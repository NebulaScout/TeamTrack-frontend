import React, { useState } from "react";
import { FiMail, FiCopy, FiUsers, FiX } from "react-icons/fi";
import modalStyles from "@/styles/modals.module.css";

export default function TeamInviteModal({ setShowInviteModal }) {
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "Member",
    department: "",
  });

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    console.log("Invite sent:", inviteForm);
    setShowInviteModal(false);
    setInviteForm({ email: "", role: "Member", department: "" });
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText("https://teamtrack.app/invite/abc123xyz");
    alert("Invite link copied to clipboard!");
  };
  return (
    <div
      className={modalStyles.modalOverlay}
      onClick={() => setShowInviteModal(false)}
    >
      <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={modalStyles.modalHeader}>
          <div className={modalStyles.modalTitleWrapper}>
            <FiUsers className={modalStyles.modalTitleIcon} />
            <div>
              <h2>Invite Team Member</h2>
              <p className={modalStyles.modalSubtitle}>
                Send an invitation to collaborate on your projects.
              </p>
            </div>
          </div>
          <button
            className={modalStyles.btnClose}
            onClick={() => setShowInviteModal(false)}
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleInviteSubmit}>
          <div className={modalStyles.formGroup}>
            <label>Email Address</label>
            <div className={modalStyles.emailInputWrapper}>
              <FiMail className={modalStyles.inputIcon} />
              <input
                type="email"
                placeholder="colleague@company.com"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm({
                    ...inviteForm,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Role</label>
              <select
                value={inviteForm.role}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, role: e.target.value })
                }
              >
                <option value="Guest">Guest</option>
                <option value="Developer">Developer</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className={modalStyles.formGroup}>
              <label>Department (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Engineering"
                value={inviteForm.department}
                onChange={(e) =>
                  setInviteForm({
                    ...inviteForm,
                    department: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className={modalStyles.inviteLinkSection}>
            <label>Or share invite link</label>
            <div className={modalStyles.inviteLinkWrapper}>
              <input
                type="text"
                value="https://teamtrack.app/invite/abc123xyz"
                readOnly
              />
              <button
                type="button"
                className={modalStyles.btnCopy}
                onClick={copyInviteLink}
              >
                <FiCopy />
              </button>
            </div>
            <span className={modalStyles.inviteLinkHelp}>
              Anyone with this link can join your team as a member.
            </span>
          </div>

          <div className={modalStyles.modalActions}>
            <button
              type="button"
              className={modalStyles.btnCancel}
              onClick={() => setShowInviteModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className={modalStyles.btnCreate}>
              <FiMail /> Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
