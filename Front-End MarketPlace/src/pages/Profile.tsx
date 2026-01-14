import { useEffect, useState, useRef } from "react";
import type { Listing } from "../types/listing";
import { updateProfile, getProfileImage, uploadProfileImage, updateProfileImage, deleteProfileImage } from "../services/profile";
import { useAuth } from "../hooks/auth";
import { fetchProfileById } from "../services/profile";
import type { Profile as ProfileType } from "../types/profile";
import { productsService } from "../services/products.service";
import { uploadImage } from "../services/upload.service";
import { Pencil, User } from "lucide-react";

export default function Profile() {
  const { user } = useAuth(); // <-- PEGA O USUÁRIO LOGADO
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowImageMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {    async function loadProfile() {
      try {
        if (!user?.id) return;

        setLoading(true);

        const profileData = await fetchProfileById(user.id);
        setProfile(profileData);
        setForm({
          name: profileData.name,
          email: profileData.email,
        });

        // Carregar foto de perfil
        try {
          const imageData = await getProfileImage(user.id);
          if (imageData?.imageUrl) {
            setProfileImageUrl(imageData.imageUrl);
          }
        } catch (err) {
          console.log("Sem foto de perfil");
        }

        const userListings = await productsService.getByProfile(user.id);
        setListings(userListings);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setUploadingImage(true);
      
      // Upload da imagem
      const imageUrl = await uploadImage(file);
      
      // Verificar se já existe uma foto
      try {
        await getProfileImage(user.id);
        // Se existe, atualizar
        await updateProfileImage(user.id, imageUrl);
      } catch {
        // Se não existe, criar nova
        await uploadProfileImage(user.id, imageUrl);
      }
      
      setProfileImageUrl(imageUrl);
      
      // Atualizar localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.photoUrl = imageUrl;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // Disparar evento para atualizar a Navbar
      window.dispatchEvent(new Event('profileImageUpdated'));
    } catch (err) {
      console.error("Erro ao fazer upload da imagem:", err);
      alert("Erro ao fazer upload da imagem");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleDeleteImage() {
    if (!user?.id) return;

    try {
      setUploadingImage(true);
      await deleteProfileImage(user.id);
      setProfileImageUrl(null);
      
      // Atualizar localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        delete userData.photoUrl;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // Disparar evento para atualizar a Navbar
      window.dispatchEvent(new Event('profileImageUpdated'));
    } catch (err) {
      console.error("Erro ao deletar imagem:", err);
      alert("Erro ao deletar imagem");
    } finally {
      setUploadingImage(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    if (!user?.id) return;
    try {
      setSaving(true);

      const updated = await updateProfile(user.id, {
        name: form.name,
        email: form.email,
      });

      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      alert("Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <p className="text-center text-[var(--color-error)] mt-10">
        Você precisa estar logado para ver seu perfil.
      </p>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-[var(--color-text)]">
            Carregando perfil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-[var(--color-bg)] px-4 py-10">
      <div className="bg-[var(--color-card)] rounded-2xl shadow-lg p-10 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6 text-center">
          Meu Perfil
        </h1>

        {/* Foto de Perfil */}
        <div className="flex justify-center mb-8">
          <div className="relative" ref={menuRef}>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-primary)] shadow-lg">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-alt)]">
                  <User size={64} className="text-[var(--color-text-muted)]" />
                </div>
              )}
            </div>
            
            {/* Botão de lápis */}
            <button
              onClick={() => {
                if (profileImageUrl) {
                  setShowImageMenu(!showImageMenu);
                } else {
                  fileInputRef.current?.click();
                }
              }}
              disabled={uploadingImage}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white flex items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {uploadingImage ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Pencil size={20} />
              )}
            </button>
            
            {/* Menu dropdown */}
            {showImageMenu && profileImageUrl && (
              <div className="absolute top-7 left-30 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10 min-w-[140px]">
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowImageMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                >
                  Alterar foto
                </button>
                <button
                  onClick={() => {
                    handleDeleteImage();
                    setShowImageMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm font-semibold transition-colors" style={{color: 'var(--color-critical)'}}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(179, 38, 30, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Deletar foto
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div>
            <p className="font-semibold text-gray-700">Nome:</p>

            {isEditing ? (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
            ) : (
              <p className="text-lg text-gray-900">{profile?.name}</p>
            )}
          </div>

          <div>
            <p className="font-semibold text-gray-700">Email:</p>

            {isEditing ? (
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
            ) : (
              <p className="text-lg text-gray-900">{profile?.email}</p>
            )}
          </div>

          <div className="flex gap-3 mb-8">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#9878f3] text-white px-4 py-2 rounded-lg"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="border px-4 py-2 rounded-lg"
              >
                Editar perfil
              </button>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4 border-b pb-2">
            Seus anúncios
          </h2>

          {listings.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {listings.map((item) => (
                <li
                  key={item.id}
                  className="border border-[var(--color-border)] rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all bg-[var(--color-bg-alt)]"
                  onClick={() => (window.location.href = `/listing/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <h3 className="font-bold text-[var(--color-text)] text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-sm text-[var(--color-text)] mt-3">
                    <span className="font-semibold">Preço:</span> R${" "}
                    {item.price}
                  </p>
                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full ${
                      item.type === "offer"
                        ? "bg-[var(--color-secondary-light)] text-[var(--color-secondary-dark)]"
                        : "bg-[var(--color-secondary)] text-[var(--color-text-invert)]"
                    } uppercase`}
                  >
                    {item.type}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--color-text-muted)] text-center mt-4">
              Você ainda não possui anúncios.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
