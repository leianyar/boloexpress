import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Profile() {
  const savedUser = JSON.parse(localStorage.getItem("@BoloExpress:user"));

  const [profileData, setProfileData] = useState({
    name: savedUser?.name || "",
    email: savedUser?.email || "",
    phone: savedUser?.phone || "",
    role: savedUser?.role || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [message, setMessage] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfileData({
      ...profileData,
      [name]: value
    });
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswordData({
      ...passwordData,
      [name]: value
    });
  }

  async function handleUpdateProfile(event) {
    event.preventDefault();

    try {
      setLoadingProfile(true);
      setMessage("");

      const response = await api.patch("/auth/profile", {
        name: profileData.name,
        phone: profileData.phone
      });

      localStorage.setItem(
        "@BoloExpress:user",
        JSON.stringify(response.data.user)
      );

      setMessage("Perfil atualizado com sucesso.");
    } catch (error) {
      console.log(error);
      setMessage(
        error.response?.data?.message || "Erro ao atualizar perfil."
      );
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handleChangePassword(event) {
    event.preventDefault();

    try {
      setLoadingPassword(true);
      setMessage("");

      await api.patch("/auth/change-password", passwordData);

      setPasswordData({
        currentPassword: "",
        newPassword: ""
      });

      setMessage("Senha alterada com sucesso.");
    } catch (error) {
      console.log(error);
      setMessage(
        error.response?.data?.message || "Erro ao alterar senha."
      );
    } finally {
      setLoadingPassword(false);
    }
  }

  return (
    <div className="site">
      <Navbar />

      <section className="profile-hero">
        <span>Minha Conta</span>
        <h1>Perfil do Utilizador</h1>
        <p>
          Consulte e atualize os seus dados pessoais usados no sistema
          BoloExpress.
        </p>
      </section>

      {message && <div className="page-alert">{message}</div>}

      <section className="profile-layout">
        <form className="profile-card" onSubmit={handleUpdateProfile}>
          <div className="profile-card-header">
            <h2>Dados pessoais</h2>
            <p>Atualize o seu nome e contacto.</p>
          </div>

          <label>Nome completo</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            disabled
          />

          <label>Telefone</label>
          <input
            type="text"
            name="phone"
            value={profileData.phone || ""}
            onChange={handleProfileChange}
          />

          <label>Tipo de utilizador</label>
          <input
            type="text"
            value={profileData.role}
            disabled
          />

          <button type="submit" disabled={loadingProfile}>
            {loadingProfile ? "A guardar..." : "Guardar alterações"}
          </button>
        </form>

        <form className="profile-card" onSubmit={handleChangePassword}>
          <div className="profile-card-header">
            <h2>Alterar senha</h2>
            <p>Use uma senha segura para proteger a sua conta.</p>
          </div>

          <label>Senha atual</label>
          <input
            type="password"
            name="currentPassword"
            placeholder="Digite a senha atual"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            required
          />

          <label>Nova senha</label>
          <input
            type="password"
            name="newPassword"
            placeholder="Digite a nova senha"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            required
          />

          <button type="submit" disabled={loadingPassword}>
            {loadingPassword ? "A alterar..." : "Alterar senha"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Profile;