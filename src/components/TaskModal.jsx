import React, { useState } from "react";
import { mockTeamMembers, mockProjectsList } from "@/utils/mockData";
import { FiX } from "react-icons/fi";
import modalStyles from "@/styles/modals.module.css";

export default function TaskModal({ tasks, setTasks, setShowModal }) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project: "",
    assignee: "",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
  });

  const handleCreateTask = (e) => {
    e.preventDefault();

    const selectedAssignee = mockTeamMembers.find(
      (member) => member.name === newTask.assignee,
    );

    const task = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      project: newTask.project,
      status: newTask.status,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      assignee: selectedAssignee || { name: "", avatar: "" },
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      project: "",
      assignee: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
    });
    setShowModal(false);
  };

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.modalHeader}>
          <h2>Create New Task</h2>
          <button
            className={modalStyles.btnClose}
            onClick={() => setShowModal(false)}
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleCreateTask}>
          <div className={modalStyles.formGroup}>
            <label>Task Title</label>
            <input
              type="text"
              placeholder="Enter task title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              required
            />
          </div>

          <div className={modalStyles.formGroup}>
            <label>Description</label>
            <textarea
              placeholder="Describe what needs to be done..."
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Project</label>
              <select
                value={newTask.project}
                onChange={(e) =>
                  setNewTask({ ...newTask, project: e.target.value })
                }
              >
                <option value="">Select project</option>
                {mockProjectsList.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>

            <div className={modalStyles.formGroup}>
              <label>Assignee</label>
              <select
                value={newTask.assignee}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignee: e.target.value })
                }
              >
                <option value="">Select assignee</option>
                {mockTeamMembers.map((member) => (
                  <option key={member.name} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Status</label>
              <select
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className={modalStyles.formGroup}>
              <label>Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className={modalStyles.formGroup}>
            <label>Due Date</label>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
            />
          </div>

          <div className={modalStyles.modalActions}>
            <button
              type="button"
              className={modalStyles.btnCancel}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button type="submit" className={modalStyles.btnCreate}>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
