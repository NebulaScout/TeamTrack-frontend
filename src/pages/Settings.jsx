import React, { useState } from "react";
import { FiUser, FiBell, FiShield, FiSun, FiUpload } from "react-icons/fi";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthProvider";
import styles from "@/styles/dashboard.module.css";
import settingStyles from "@/styles/settings.module.css";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "John",
    lastName: user?.lastName || "Doe",
    email: user?.email || "john.doe@teamtrack.com",
    phone: user?.phone || "+254-77902573",
    bio: user?.bio || "Product Designer at Team Track",
  });

  const [profileImage, setProfileImage] = useState(null);

  const tabs = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "security", label: "Security", icon: FiShield },
    { id: "appearance", label: "Appearance", icon: FiSun },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    console.log("Saving profile: ", profileForm);
    // TODO: Implement API call to save profile
    alert("Profile saved successfully!");
  };

  const renderProfileTab = () => (
    <div className={settingStyles.settingsCard}>
      <h3 className={settingStyles.cardTitle}>Profile Information</h3>

      <div className={settingStyles.avatarSection}>
        <div className={settingStyles.avatarPreview}>
          {profileImage ? (
            <img src={profileImage} alt="Profile" />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              alt="Profile"
            />
          )}
        </div>

        <div className={settingStyles.avatarActions}>
          <label className={settingStyles.btnUpload}>
            <FiUpload />
            Change photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleImageChange}
              hidden
            />
          </label>
          <span className={settingStyles.avatarHelp}>
            JPG, GIF or PNG. Max size 2MB.
          </span>
        </div>
      </div>

      <form onSubmit={handleSaveChanges}>
        <div className={settingStyles.formRow}>
          <div className={settingStyles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileForm.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className={settingStyles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profileForm.lastName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={settingStyles.formRow}>
          <div className={settingStyles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileForm.email}
              onChange={handleInputChange}
            />
          </div>
          <div className={settingStyles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profileForm.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={settingStyles.formGroup}>
          <label htmlFor="bio">Bio</label>
          <input
            type="text"
            id="bio"
            name="bio"
            value={profileForm.bio}
            onChange={handleInputChange}
          />
        </div>

        <div className={settingStyles.formActions}>
          <button type="submit" className={settingStyles.btnSave}>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className={settingStyles.settingsCard}>
      <h3 className={settingStyles.cardTitle}>Notification Preferences</h3>
      <p className={settingStyles.cardDescription}>
        Consfigure how you receive notifications.
      </p>
      {/* TODO: Implement notifications settings */}
      <p className={settingStyles.placeHolder}>Page Under Construction...</p>
    </div>
  );

  const renderSecurityTab = () => (
    <div className={settingStyles.settingsCard}>
      <h3 className={settingStyles.cardTitle}>Security Settings</h3>
      <p className={settingStyles.cardDescription}>
        Manage your password and security preferences.
      </p>
      {/* TODO: Implement security settings */}
      <p className={settingStyles.placeHolder}>Page Under Construction...</p>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className={settingStyles.settingsCard}>
      <h3 className={settingStyles.cardTitle}>Appearance</h3>
      <p className={settingStyles.cardDescription}>
        Customize the look and feel of your workspace
      </p>
      {/* TODO: Implement appearance settings */}
      <p className={settingStyles.placeHolder}>Page Under Construction...</p>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "notifications":
        return renderNotificationsTab();
      case "security":
        return renderSecurityTab();
      case "appearance":
        return renderAppearanceTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <SideBar />
      <main className={styles.mainContent}>
        <Header title="Settings" pageIntro="Manage your account preferences" />

        <div className={settingStyles.settingsContainer}>
          {/* Tab navigation */}
          <div className={settingStyles.tabsNav}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`${settingStyles.tabBtn} ${activeTab === tab.id && settingStyles.tabBtnActive}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className={settingStyles.tabIcon} />
                  {tab.label}
                </button>
              );
            })}
          </div>
          {/* Tab Content */}
          <div className={settingStyles.tabContent}>{renderActiveTab()}</div>
        </div>
      </main>
    </div>
  );
}
