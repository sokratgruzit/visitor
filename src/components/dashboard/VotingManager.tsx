import React, { useState, useEffect } from "react";
import { getVotings, createVoting, updateVoting, deleteVoting } from "../../api/voting";
import { makePayment } from "../../api/payment";
import { useNotificationStore } from "../../store/notificationStore";
import { useAuthStore } from "../../store/useAuthStore";
import type { Voting, VotingResponse } from "../../types";

import styles from "./VotingManager.module.css";

export const VotingManager: React.FC = () => {
	const [tab, setTab] = useState<"my" | "all">("my");
	const [votings, setVotings] = useState<Voting[]>([]);
	const [loading, setLoading] = useState(false);
	const [newVoting, setNewVoting] = useState({ title: "", description: "" });
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editingData, setEditingData] = useState({ title: "", description: "", level: 0 });
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

	const notify = useNotificationStore((state) => state.showNotification);
	const { user } = useAuthStore();
	const itemsPerPage = 10;

	const fetchVotings = async (page = 1) => {
		setLoading(true);
		const res: VotingResponse = await getVotings({ page, limit: itemsPerPage, userId: user?.id || undefined });

		if (res.success) {
			const data = tab === "my" ? res.my : res.all;
			if (data) {
				setVotings(data.votings);
				setTotalPages(data.totalPages);
				setCurrentPage(data.currentPage);
			} else {
				setVotings([]);
				setTotalPages(1);
				setCurrentPage(1);
			}
		} else {
			notify({ type: "error", message: res.message || "Не удалось загрузить голосования" });
		}
		setLoading(false);
	};

	useEffect(() => {
		setCurrentPage(1);
		fetchVotings(1);
	}, [tab]);

	const handleCreate = async () => {
		if (!newVoting.title || !newVoting.description) {
			notify({ type: "error", message: "Заполните все поля" });
			return;
		}
		setLoading(true);
		const res = await createVoting({
			title: newVoting.title,
			description: newVoting.description,
			level: 0,
			status: "pending",
			creatorId: user?.id
		});
		if (res.success) {
			notify({ type: "success", message: "Голосование создано" });
			setNewVoting({ title: "", description: "" });
			fetchVotings(currentPage);
		} else {
			notify({ type: "error", message: res.message || "Ошибка создания голосования" });
		}
		setLoading(false);
	};

	const handleUpdate = async (id: number, data: any) => {
		setLoading(true);
		const res = await updateVoting(id, data);
		if (res.success) {
			notify({ type: "success", message: "Голосование обновлено" });
			setEditingId(null);
			fetchVotings(currentPage);
		} else {
			notify({ type: "error", message: res.message || "Ошибка обновления" });
		}
		setLoading(false);
	};

	const handleDelete = async (id: number) => {
		setDeleteConfirmId(id);
	};

	const confirmDelete = async (id: number) => {
		setLoading(true);
		const res = await deleteVoting(id);
		if (res.success) {
			notify({ type: "success", message: "Голосование удалено" });
			fetchVotings(currentPage);
		} else {
			notify({ type: "error", message: res.message || "Ошибка удаления" });
		}
		setDeleteConfirmId(null);
		setLoading(false);
	};

	const handleVote = async (id: number) => {
		setLoading(true);
		const res = await makePayment({ product: "voting", targetId: id, amount: 39 });
		if (res.success && res.confirmationUrl) {
			window.location.href = res.confirmationUrl;
		} else {
			notify({ type: "error", message: res.message || "Ошибка при голосовании" });
		}
		setLoading(false);
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Голосования</h1>

			<div className={styles.tabs}>
				<button
					className={tab === "my" ? styles.activeTab : ""}
					onClick={() => setTab("my")}
				>
					Мои предложения
				</button>
				<button
					className={tab === "all" ? styles.activeTab : ""}
					onClick={() => setTab("all")}
				>
					Все предложения
				</button>
			</div>

			{tab === "my" && (
				<div className={styles.newVoting}>
					<input
						className={styles.input}
						type="text"
						placeholder="Название"
						value={newVoting.title}
						onChange={(e) => setNewVoting({ ...newVoting, title: e.target.value })}
					/>
					<input
						className={styles.input}
						type="text"
						placeholder="Описание"
						value={newVoting.description}
						onChange={(e) => setNewVoting({ ...newVoting, description: e.target.value })}
					/>
					<button className={styles.button} onClick={handleCreate} disabled={loading}>
						Создать
					</button>
				</div>
			)}

			<table className={styles.table}>
				<thead>
					<tr>
						<th>Название</th>
						<th>Описание</th>
						<th>Level</th>
						<th>Статус</th>
						<th>Действия</th>
					</tr>
				</thead>
				<tbody>
					{votings.length === 0 && (
						<tr>
							<td colSpan={5} style={{ textAlign: "center" }}>Нет голосований</td>
						</tr>
					)}
					{votings.map((v) => (
						<tr key={v.id}>
							<td>
								{editingId === v.id
									? <input className={styles.input} value={editingData.title} onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}/>
									: v.title
								}
							</td>
							<td>
								{editingId === v.id
									? <input className={styles.input} value={editingData.description} onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}/>
									: v.description
								}
							</td>
							<td>{v.level}</td>
							<td>{v.status}</td>
							<td style={{ display: "flex", gap: 10 }}>
								{tab === "my" && v.status === "pending" && (
									editingId === v.id
										? <>
											<button className={styles.button} onClick={() => handleUpdate(v.id, editingData)}>Сохранить</button>
											<button className={styles.button} onClick={() => setEditingId(null)}>Отмена</button>
										</>
										: <>
											<button className={styles.button} onClick={() => { setEditingId(v.id); setEditingData({ title: v.title, description: v.description, level: v.level }); }}>Редактировать</button>
											<button className={styles.button} onClick={() => handleDelete(v.id)}>Удалить</button>
										</>
								)}
								{tab === "all" && (
									<button className={styles.button} onClick={() => handleVote(v.id)}>Проголосовать</button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{deleteConfirmId !== null && (
				<div className={styles.deleteConfirm}>
					<p>Вы точно хотите удалить это голосование?</p>
					<div className={styles.confirmActions}>
						<button className={styles.button} onClick={() => confirmDelete(deleteConfirmId)}>Да</button>
						<button className={styles.button} onClick={() => setDeleteConfirmId(null)}>Отмена</button>
					</div>
				</div>
			)}

			<div className={styles.pagination}>
				<button className={styles.button} disabled={currentPage === 1} onClick={() => { const prev = currentPage - 1; setCurrentPage(prev); fetchVotings(prev); }}>Назад</button>
				<span>Страница {currentPage} из {totalPages}</span>
				<button className={styles.button} disabled={currentPage === totalPages} onClick={() => { const next = currentPage + 1; setCurrentPage(next); fetchVotings(next); }}>Вперед</button>
			</div>
		</div>
	);
};
