import React, { useState } from "react";
import './App.css';

export default function App() {
  const [exhibitions, setExhibitions] = useState([
    {
      id: 1,
      title: "(예시) 부산시립미술관 특별전",
      date: "2025-03-26",
      location: "부산시립미술관 A전시관",
      description: "현대미술의 흐름을 조망하는 기획 전시입니다.",
      password: "admin",
      comments: [
        { text: "참여 원합니다(홍길동/성평등가족연구부).", password: "pw1" },
        { text: "참여 원합니다(홍길동/평생교육진흥부)", password: "pw2" },
        { text: "참여 원합니다(홍길동/운영지원부)", password: "pw3" },
        { text: "참여 원합니다.(홍길동/경영혁신실)", password: "pw4" }
      ]
    }
  ]);

  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newCommentPassword, setNewCommentPassword] = useState("");
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const [newExhibition, setNewExhibition] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    password: ""
  });
  const [isEditingExhibition, setIsEditingExhibition] = useState(false);
  const [editingExhibitionData, setEditingExhibitionData] = useState(null);

  const ADMIN_PASSWORD = "admin123";

  const handleCommentSubmit = () => {
    if (!newComment || !newCommentPassword) return;
    const updated = exhibitions.map((ex) =>
      ex.id === selectedExhibition.id
        ? {
            ...ex,
            comments: [...ex.comments, { text: newComment, password: newCommentPassword }]
          }
        : ex
    );
    setExhibitions(updated);
    setNewComment("");
    setNewCommentPassword("");
    setSelectedExhibition({
      ...selectedExhibition,
      comments: [...selectedExhibition.comments, { text: newComment, password: newCommentPassword }]
    });
  };

  const handleCommentDelete = (idx) => {
    const password = prompt("댓글 삭제를 위해 비밀번호를 입력하세요:");
    if (
      password === ADMIN_PASSWORD ||
      password === selectedExhibition.comments[idx].password
    ) {
      if (!window.confirm("정말 이 댓글을 삭제하시겠습니까?")) return;
      const updatedComments = selectedExhibition.comments.filter((_, i) => i !== idx);
      const updatedExhibitions = exhibitions.map((ex) =>
        ex.id === selectedExhibition.id ? { ...ex, comments: updatedComments } : ex
      );
      setExhibitions(updatedExhibitions);
      setSelectedExhibition({ ...selectedExhibition, comments: updatedComments });
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleCommentEdit = (idx) => {
    setEditingCommentIndex(idx);
    setEditingCommentText(selectedExhibition.comments[idx].text);
  };

  const handleCommentEditSave = (idx) => {
    const password = prompt("댓글 수정을 위해 비밀번호를 입력하세요:");
    if (
      password === ADMIN_PASSWORD ||
      password === selectedExhibition.comments[idx].password
    ) {
      const updatedComments = selectedExhibition.comments.map((c, i) =>
        i === idx ? { ...c, text: editingCommentText } : c
      );
      const updatedExhibitions = exhibitions.map((ex) =>
        ex.id === selectedExhibition.id ? { ...ex, comments: updatedComments } : ex
      );
      setExhibitions(updatedExhibitions);
      setSelectedExhibition({ ...selectedExhibition, comments: updatedComments });
      setEditingCommentIndex(null);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleNewExhibitionSubmit = () => {
    if (!newExhibition.title || !newExhibition.date || !newExhibition.location || !newExhibition.password) return;
    const newId = exhibitions.length + 1;
    const exhibition = {
      id: newId,
      ...newExhibition,
      comments: []
    };
    setExhibitions([exhibition, ...exhibitions]);
    setNewExhibition({ title: "", date: "", location: "", description: "", password: "" });
  };

  const handleExhibitionDelete = (id) => {
    const exhibition = exhibitions.find((ex) => ex.id === id);
    if (exhibition.comments.length > 0) {
      alert("댓글이 있는 전시는 삭제할 수 없습니다.");
      return;
    }
    const password = prompt("전시 삭제를 위해 비밀번호를 입력하세요:");
    if (password === ADMIN_PASSWORD || password === exhibition.password) {
      if (!window.confirm("정말 이 전시를 삭제하시겠습니까?")) return;
      const updated = exhibitions.filter((ex) => ex.id !== id);
      setExhibitions(updated);
      setSelectedExhibition(null);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleExhibitionEdit = (exhibition) => {
    setIsEditingExhibition(true);
    setEditingExhibitionData(exhibition);
  };

  const handleExhibitionEditSave = () => {
    const password = prompt("전시 수정을 위해 비밀번호를 입력하세요:");
    if (
      password === ADMIN_PASSWORD ||
      password === editingExhibitionData.password
    ) {
      const updated = exhibitions.map((ex) =>
        ex.id === editingExhibitionData.id ? editingExhibitionData : ex
      );
      setExhibitions(updated);
      setIsEditingExhibition(false);
      setEditingExhibitionData(null);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="container">
      <h1>부산여성가족과 평생교육진흥원 문화의 날 팀 모집</h1>

      {!selectedExhibition ? (
        <>
          <h2>전시, 행사 등록</h2>
          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "8px" }}>
          문화의 날에 가고 싶은 전시, 행사를 등록해보세요. 일정, 장소, 설명을 함께 입력할 수 있어요.
          </p>
          <div className="flex" style={{ flexDirection: "column" }}>
            <input placeholder="전시 제목" value={newExhibition.title} onChange={(e) => setNewExhibition({ ...newExhibition, title: e.target.value })} />
            <input type="date" value={newExhibition.date} onChange={(e) => setNewExhibition({ ...newExhibition, date: e.target.value })} />
            <input placeholder="전시장소" value={newExhibition.location} onChange={(e) => setNewExhibition({ ...newExhibition, location: e.target.value })} />
            <textarea placeholder="설명" value={newExhibition.description} onChange={(e) => setNewExhibition({ ...newExhibition, description: e.target.value })} />
            <input placeholder="비밀번호 (삭제/수정용)" value={newExhibition.password} onChange={(e) => setNewExhibition({ ...newExhibition, password: e.target.value })} />
            <button onClick={handleNewExhibitionSubmit}>전시, 행사 등록</button>
          </div>

          <h2>전시,  행사 목록</h2>
          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "8px" }}>
          여러분들이 등록해주신 전시, 행사입니다. 등록된 겻들 중 동행하고 싶은 전시, 행사를 클릭해 참여 댓글을 남길 수 있어요.
          </p>
          {exhibitions.map((exhibition) => (
            <div key={exhibition.id} className="card">
              <div onClick={() => setSelectedExhibition(exhibition)} style={{ cursor: "pointer" }}>
                <h3>{exhibition.title}</h3>
                <p>{exhibition.date} | {exhibition.location}</p>
              </div>
              <div className="flex" style={{ marginTop: "8px" }}>
                <button onClick={() => handleExhibitionDelete(exhibition.id)}>삭제</button>
                <button onClick={() => handleExhibitionEdit(exhibition)}>수정</button>
              </div>
            </div>
          ))}

          {isEditingExhibition && (
            <div className="card">
              <h3>전시, 행사 수정</h3>
              <input value={editingExhibitionData.title} onChange={(e) => setEditingExhibitionData({ ...editingExhibitionData, title: e.target.value })} />
              <input type="date" value={editingExhibitionData.date} onChange={(e) => setEditingExhibitionData({ ...editingExhibitionData, date: e.target.value })} />
              <input value={editingExhibitionData.location} onChange={(e) => setEditingExhibitionData({ ...editingExhibitionData, location: e.target.value })} />
              <textarea value={editingExhibitionData.description} onChange={(e) => setEditingExhibitionData({ ...editingExhibitionData, description: e.target.value })} />
              <button onClick={handleExhibitionEditSave}>저장</button>
            </div>
          )}
        </>
      ) : (
        <div>
          <button onClick={() => setSelectedExhibition(null)} style={{ marginBottom: "10px" }}>
            ← 목록으로
          </button>
          <div className="card">
            <h2>{selectedExhibition.title}</h2>
            <p>{selectedExhibition.date} | {selectedExhibition.location}</p>
            <p>{selectedExhibition.description}</p>

            <div style={{ marginTop: "20px" }}>
              <h3>댓글 모집</h3>
              <div>
                {selectedExhibition.comments.map((c, idx) => (
                  <div key={idx} className="comment-box">
                    {editingCommentIndex === idx ? (
                      <>
                        <input value={editingCommentText} onChange={(e) => setEditingCommentText(e.target.value)} style={{ flexGrow: 1 }} />
                        <button onClick={() => handleCommentEditSave(idx)}>저장</button>
                      </>
                    ) : (
                      <>
                        <span>{c.text}</span>
                        <div>
                          <button onClick={() => handleCommentEdit(idx)}>✏️</button>
                          <button onClick={() => handleCommentDelete(idx)}>🗑️</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="comment-input-box">
                <div className="flex">
                  <input placeholder="참여 원합니다(홍길동/성평등가족연구부)" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                  <input placeholder="비밀번호(삭제/수정용)" type="password" value={newCommentPassword} onChange={(e) => setNewCommentPassword(e.target.value)} />
                  <button onClick={handleCommentSubmit}>등록</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
