import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Edit,
  Eye,
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  Newspaper,
  Plus,
  RotateCcw,
  Save,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import { useSearchParams } from "react-router";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { useAuth } from "../../context/AuthContext";
import { getManagedUsers } from "../../data/admin/superAdminAdministrationStore";
import {
  createWebsiteId,
  getWebsiteCategories,
  getWebsiteGalleries,
  getWebsitePages,
  getWebsitePosts,
  saveWebsiteCategories,
  saveWebsiteGalleries,
  saveWebsitePages,
  saveWebsitePosts,
  type WebsiteCategoryItem,
  type WebsiteGalleryItem,
  type WebsitePageItem,
  type WebsitePostItem,
  type WebsitePostStatus,
} from "../../data/admin/superAdminWebsiteStore";

type WebsiteTab = "posting" | "halaman" | "kategori" | "galeri";
type ContentMode = "list" | "form" | "detail";
type ConfirmState = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
};

type PostForm = Omit<WebsitePostItem, "id" | "views">;
type PageForm = Pick<WebsitePageItem, "judul" | "excerpt" | "body">;
type CategoryForm = Pick<WebsiteCategoryItem, "nama" | "slug">;
type GalleryForm = Omit<WebsiteGalleryItem, "id">;

const REGION_OPTIONS = ["homepage", "riset", "pkm", "pengumuman"] as const;

function normalizeTab(value: string | null): WebsiteTab {
  if (value === "halaman" || value === "kategori" || value === "galeri") return value;
  return "posting";
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function pickValues(event: ChangeEvent<HTMLSelectElement>) {
  return Array.from(event.target.selectedOptions, (option) => option.value);
}

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function createEmptyPost(editor: string): PostForm {
  return {
    judul: "",
    penulis: [],
    editor,
    kategoris: [],
    excerpt: "",
    body: "",
    regionberita: [],
    image: null,
    namaimage: "",
    figcaption: "",
    published_at: today(),
    status: "draft",
  };
}

function createEmptyPage(): PageForm {
  return { judul: "", excerpt: "", body: "" };
}

function createEmptyCategory(): CategoryForm {
  return { nama: "", slug: "" };
}

function createEmptyGallery(): GalleryForm {
  return { nama: "", deskripsi: "", tanggal: today(), coverImage: null };
}

export function ArtikelAdminPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = normalizeTab(searchParams.get("tab"));
  const currentEditor = user?.name ?? "Raka Pratama";
  const postImageRef = useRef<HTMLInputElement>(null);
  const galleryImageRef = useRef<HTMLInputElement>(null);
  const authorOptions = useMemo(() => Array.from(new Set(getManagedUsers().map((item) => item.name))), []);

  const [posts, setPosts] = useState<WebsitePostItem[]>(() => getWebsitePosts());
  const [pages, setPages] = useState<WebsitePageItem[]>(() => getWebsitePages());
  const [categories, setCategories] = useState<WebsiteCategoryItem[]>(() => getWebsiteCategories());
  const [galleries, setGalleries] = useState<WebsiteGalleryItem[]>(() => getWebsiteGalleries());

  const [postMode, setPostMode] = useState<ContentMode>("list");
  const [pageMode, setPageMode] = useState<ContentMode>("list");
  const [postSearch, setPostSearch] = useState("");
  const [pageSearch, setPageSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [gallerySearch, setGallerySearch] = useState("");
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedGalleryIds, setSelectedGalleryIds] = useState<string[]>([]);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState<PostForm>(() => createEmptyPost(currentEditor));
  const [pageForm, setPageForm] = useState<PageForm>(() => createEmptyPage());
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(() => createEmptyCategory());
  const [galleryForm, setGalleryForm] = useState<GalleryForm>(() => createEmptyGallery());
  const [confirm, setConfirm] = useState<ConfirmState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredPosts = useMemo(() => {
    const keyword = postSearch.toLowerCase();
    return posts.filter((item) =>
      [item.judul, item.excerpt, item.editor, item.kategoris.join(" "), item.penulis.join(" ")]
        .some((value) => value.toLowerCase().includes(keyword)),
    );
  }, [postSearch, posts]);

  const filteredPages = useMemo(() => {
    const keyword = pageSearch.toLowerCase();
    return pages.filter((item) => [item.judul, item.excerpt, item.body].some((value) => value.toLowerCase().includes(keyword)));
  }, [pageSearch, pages]);

  const filteredCategories = useMemo(() => {
    const keyword = categorySearch.toLowerCase();
    return categories.filter((item) => [item.nama, item.slug].some((value) => value.toLowerCase().includes(keyword)));
  }, [categories, categorySearch]);

  const filteredGalleries = useMemo(() => {
    const keyword = gallerySearch.toLowerCase();
    return galleries.filter((item) => [item.nama, item.deskripsi].some((value) => value.toLowerCase().includes(keyword)));
  }, [galleries, gallerySearch]);

  const tabs = [
    { key: "posting" as const, label: "Posting Website", icon: Newspaper },
    { key: "halaman" as const, label: "Halaman Website", icon: LayoutTemplate },
    { key: "kategori" as const, label: "Kategori", icon: Tag },
    { key: "galeri" as const, label: "Galeri", icon: ImageIcon },
  ];

  const activePost = posts.find((item) => item.id === activePostId) ?? null;
  const activePage = pages.find((item) => item.id === activePageId) ?? null;
  const categoryOptions = Array.from(new Set(categories.map((item) => item.nama)));

  const changeTab = (tab: WebsiteTab) => {
    setSearchParams(tab === "posting" ? {} : { tab });
  };

  const persistPosts = (next: WebsitePostItem[]) => {
    setPosts(next);
    saveWebsitePosts(next);
  };

  const persistPages = (next: WebsitePageItem[]) => {
    setPages(next);
    saveWebsitePages(next);
  };

  const persistCategories = (next: WebsiteCategoryItem[]) => {
    setCategories(next);
    saveWebsiteCategories(next);
  };

  const persistGalleries = (next: WebsiteGalleryItem[]) => {
    setGalleries(next);
    saveWebsiteGalleries(next);
  };

  const openNewPost = () => {
    setActivePostId(null);
    setPostForm(createEmptyPost(currentEditor));
    setPostMode("form");
  };

  const openEditPost = (post: WebsitePostItem) => {
    setActivePostId(post.id);
    setPostForm({ ...post });
    setPostMode("form");
  };

  const openNewPage = () => {
    setActivePageId(null);
    setPageForm(createEmptyPage());
    setPageMode("form");
  };

  const openEditPage = (page: WebsitePageItem) => {
    setActivePageId(page.id);
    setPageForm({ judul: page.judul, excerpt: page.excerpt, body: page.body });
    setPageMode("form");
  };

  const askDelete = (title: string, message: string, onConfirm: () => void) => {
    setConfirm({
      isOpen: true,
      title,
      message,
      confirmLabel: "Hapus",
      onConfirm,
    });
  };

  const savePost = (status: WebsitePostStatus) => {
    if (!postForm.judul.trim() || !postForm.body.trim()) {
      setToast("Judul dan body posting wajib diisi.");
      return;
    }
    const payload: WebsitePostItem = {
      id: activePostId ?? createWebsiteId("POST", posts.map((item) => item.id)),
      views: activePost?.views ?? 0,
      ...postForm,
      editor: postForm.editor || currentEditor,
      status,
    };
    const next = activePostId ? posts.map((item) => (item.id === activePostId ? payload : item)) : [payload, ...posts];
    persistPosts(next);
    setActivePostId(payload.id);
    setPostForm({ ...payload });
    setPostMode("detail");
    setToast(status === "draft" ? "Draft posting berhasil disimpan." : "Posting website berhasil disimpan.");
  };

  const savePage = () => {
    if (!pageForm.judul.trim() || !pageForm.body.trim()) {
      setToast("Judul dan body halaman wajib diisi.");
      return;
    }
    const payload: WebsitePageItem = {
      id: activePageId ?? createWebsiteId("PAGE", pages.map((item) => item.id)),
      status: activePage?.status ?? "saved",
      updated_at: today(),
      ...pageForm,
    };
    const next = activePageId ? pages.map((item) => (item.id === activePageId ? payload : item)) : [payload, ...pages];
    persistPages(next);
    setActivePageId(payload.id);
    setPageMode("detail");
    setToast("Halaman website berhasil disimpan.");
  };

  const saveCategory = () => {
    if (!categoryForm.nama.trim()) {
      setToast("Nama kategori wajib diisi.");
      return;
    }
    const payload: WebsiteCategoryItem = {
      id: editingCategoryId ?? createWebsiteId("KAT", categories.map((item) => item.id)),
      nama: categoryForm.nama.trim(),
      slug: (categoryForm.slug || slugify(categoryForm.nama)).trim(),
    };
    const next = editingCategoryId
      ? categories.map((item) => (item.id === editingCategoryId ? payload : item))
      : [payload, ...categories];
    persistCategories(next);
    setEditingCategoryId(payload.id);
    setCategoryForm({ nama: payload.nama, slug: payload.slug });
    setToast("Kategori berhasil disimpan.");
  };

  const saveGallery = () => {
    if (!galleryForm.nama.trim()) {
      setToast("Nama galeri wajib diisi.");
      return;
    }
    const payload: WebsiteGalleryItem = {
      id: editingGalleryId ?? createWebsiteId("GAL", galleries.map((item) => item.id)),
      ...galleryForm,
    };
    const next = editingGalleryId
      ? galleries.map((item) => (item.id === editingGalleryId ? payload : item))
      : [payload, ...galleries];
    persistGalleries(next);
    setEditingGalleryId(payload.id);
    setGalleryForm({
      nama: payload.nama,
      deskripsi: payload.deskripsi,
      tanggal: payload.tanggal,
      coverImage: payload.coverImage,
    });
    setToast("Galeri berhasil disimpan.");
  };

  const deletePosts = (ids: string[]) => {
    if (ids.length === 0) return;
    askDelete(
      "Hapus posting website",
      ids.length === 1 ? "Posting terpilih akan dihapus." : `${ids.length} posting akan dihapus.`,
      () => {
        const next = posts.filter((item) => !ids.includes(item.id));
        persistPosts(next);
        setSelectedPostIds([]);
        if (activePostId && ids.includes(activePostId)) {
          setActivePostId(null);
          setPostForm(createEmptyPost(currentEditor));
          setPostMode("list");
        }
        setToast("Posting website berhasil dihapus.");
      },
    );
  };

  const deletePages = (ids: string[]) => {
    if (ids.length === 0) return;
    askDelete(
      "Hapus halaman website",
      ids.length === 1 ? "Halaman terpilih akan dihapus." : `${ids.length} halaman akan dihapus.`,
      () => {
        const next = pages.filter((item) => !ids.includes(item.id));
        persistPages(next);
        setSelectedPageIds([]);
        if (activePageId && ids.includes(activePageId)) {
          setActivePageId(null);
          setPageForm(createEmptyPage());
          setPageMode("list");
        }
        setToast("Halaman website berhasil dihapus.");
      },
    );
  };

  const deleteCategories = (ids: string[]) => {
    if (ids.length === 0) return;
    askDelete(
      "Hapus kategori",
      ids.length === 1 ? "Kategori terpilih akan dihapus." : `${ids.length} kategori akan dihapus.`,
      () => {
        const next = categories.filter((item) => !ids.includes(item.id));
        persistCategories(next);
        setSelectedCategoryIds([]);
        setEditingCategoryId(null);
        setCategoryForm(createEmptyCategory());
        setToast("Kategori berhasil dihapus.");
      },
    );
  };

  const deleteGalleries = (ids: string[]) => {
    if (ids.length === 0) return;
    askDelete(
      "Hapus galeri",
      ids.length === 1 ? "Galeri terpilih akan dihapus." : `${ids.length} galeri akan dihapus.`,
      () => {
        const next = galleries.filter((item) => !ids.includes(item.id));
        persistGalleries(next);
        setSelectedGalleryIds([]);
        setEditingGalleryId(null);
        setGalleryForm(createEmptyGallery());
        setToast("Galeri berhasil dihapus.");
      },
    );
  };

  const handlePostImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = await fileToDataUrl(file);
    setPostForm((previous) => ({ ...previous, image, namaimage: file.name }));
  };

  const handleGalleryImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const coverImage = await fileToDataUrl(file);
    setGalleryForm((previous) => ({ ...previous, coverImage }));
  };

  const topActions =
    activeTab === "posting" && postMode === "list" ? (
      <>
        <button type="button" onClick={() => deletePosts(selectedPostIds)} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
          <Trash2 className="h-4 w-4" />
          Hapus
        </button>
        <button type="button" onClick={openNewPost} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]">
          <Plus className="h-4 w-4" />
          Tambah
        </button>
      </>
    ) : activeTab === "halaman" && pageMode === "list" ? (
      <>
        <button type="button" onClick={() => deletePages(selectedPageIds)} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
          <Trash2 className="h-4 w-4" />
          Hapus
        </button>
        <button type="button" onClick={openNewPage} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]">
          <Plus className="h-4 w-4" />
          Tambah
        </button>
      </>
    ) : activeTab === "kategori" ? (
      <>
        <button type="button" onClick={() => deleteCategories(selectedCategoryIds)} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
          <Trash2 className="h-4 w-4" />
          Hapus
        </button>
        <button type="button" onClick={() => { setEditingCategoryId(null); setCategoryForm(createEmptyCategory()); }} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]">
          <Plus className="h-4 w-4" />
          Tambah
        </button>
      </>
    ) : (
      <>
        <button type="button" onClick={() => deleteGalleries(selectedGalleryIds)} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
          <Trash2 className="h-4 w-4" />
          Hapus
        </button>
        <button type="button" onClick={() => { setEditingGalleryId(null); setGalleryForm(createEmptyGallery()); }} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]">
          <Plus className="h-4 w-4" />
          Tambah
        </button>
      </>
    );

  const postingSection =
    postMode === "list" ? (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>Posting Website</h3>
            <p className="mt-1 text-sm text-slate-500">Pattern content editor dengan aksi Tambah, Hapus, Detail, Edit, dan Delete.</p>
          </div>
          <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input value={postSearch} onChange={(event) => setPostSearch(event.target.value)} placeholder="Cari posting..." className="w-64 bg-transparent outline-none" />
          </label>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-3"><input type="checkbox" checked={filteredPosts.length > 0 && selectedPostIds.length === filteredPosts.length} onChange={(event) => setSelectedPostIds(event.target.checked ? filteredPosts.map((item) => item.id) : [])} /></th>
                <th className="px-3 py-3">Judul</th>
                <th className="px-3 py-3">Kategori</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Tanggal</th>
                <th className="px-3 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3"><input type="checkbox" checked={selectedPostIds.includes(item.id)} onChange={(event) => setSelectedPostIds((previous) => event.target.checked ? [...new Set([...previous, item.id])] : previous.filter((value) => value !== item.id))} /></td>
                  <td className="px-3 py-3"><p className="text-slate-900" style={{ fontWeight: 600 }}>{item.judul}</p><p className="mt-1 text-xs text-slate-500">{item.penulis.join(", ") || "-"}</p></td>
                  <td className="px-3 py-3">{item.kategoris.join(", ") || "-"}</td>
                  <td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-xs ${item.status === "published" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{item.status === "published" ? "Published" : "Draft"}</span></td>
                  <td className="px-3 py-3">{item.published_at || "-"}</td>
                  <td className="px-3 py-3"><div className="flex justify-end gap-2"><button type="button" onClick={() => { setActivePostId(item.id); setPostMode("detail"); }} className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"><Eye className="h-4 w-4" /></button><button type="button" onClick={() => openEditPost(item)} className="rounded-lg bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"><Edit className="h-4 w-4" /></button><button type="button" onClick={() => deletePosts([item.id])} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : postMode === "detail" && activePost ? (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <button type="button" onClick={() => setPostMode("list")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"><ChevronLeft className="h-4 w-4" /> Back</button>
        <div className="mt-4 grid gap-6 xl:grid-cols-[1.3fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs ${activePost.status === "published" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{activePost.status === "published" ? "Published" : "Draft"}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{activePost.published_at || "-"}</span>
            </div>
            <h2 className="mt-3 text-2xl text-slate-900" style={{ fontWeight: 700 }}>{activePost.judul}</h2>
            <p className="mt-2 text-sm text-slate-500">{activePost.excerpt}</p>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 whitespace-pre-wrap text-sm text-slate-700">{activePost.body}</div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Meta Data</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p><span style={{ fontWeight: 600 }}>Penulis:</span> {activePost.penulis.join(", ") || "-"}</p>
                <p><span style={{ fontWeight: 600 }}>Editor:</span> {activePost.editor || "-"}</p>
                <p><span style={{ fontWeight: 600 }}>Kategori:</span> {activePost.kategoris.join(", ") || "-"}</p>
                <p><span style={{ fontWeight: 600 }}>Region:</span> {activePost.regionberita.join(", ") || "-"}</p>
                <p><span style={{ fontWeight: 600 }}>Image:</span> {activePost.namaimage || "-"}</p>
                <p><span style={{ fontWeight: 600 }}>Figcaption:</span> {activePost.figcaption || "-"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => openEditPost(activePost)} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]"><Edit className="h-4 w-4" /> Edit</button>
              <button type="button" onClick={() => deletePosts([activePost.id])} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Trash2 className="h-4 w-4" /> Delete</button>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => setPostMode("list")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"><ChevronLeft className="h-4 w-4" /> Back</button>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setPostForm(activePostId && activePost ? { ...activePost } : createEmptyPost(currentEditor))} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><RotateCcw className="h-4 w-4" /> Reset</button>
            <button type="button" onClick={() => savePost("draft")} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-black"><Save className="h-4 w-4" /> Draf</button>
            <button type="button" onClick={() => savePost("published")} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]"><CheckCircle2 className="h-4 w-4" /> Submit</button>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Judul</label><input value={postForm.judul} onChange={(event) => setPostForm((previous) => ({ ...previous, judul: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Editor</label><input value={postForm.editor} onChange={(event) => setPostForm((previous) => ({ ...previous, editor: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Penulis</label><select multiple value={postForm.penulis} onChange={(event) => setPostForm((previous) => ({ ...previous, penulis: pickValues(event) }))} className="min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]">{authorOptions.map((name) => <option key={name} value={name}>{name}</option>)}</select></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Kategori</label><select multiple value={postForm.kategoris} onChange={(event) => setPostForm((previous) => ({ ...previous, kategoris: pickValues(event) }))} className="min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]">{categoryOptions.map((name) => <option key={name} value={name}>{name}</option>)}</select></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Tanggal Publish</label><div className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" /><input type="date" value={postForm.published_at} onChange={(event) => setPostForm((previous) => ({ ...previous, published_at: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-[#E30613]" /></div></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Region Berita</label><select multiple value={postForm.regionberita} onChange={(event) => setPostForm((previous) => ({ ...previous, regionberita: pickValues(event) }))} className="min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]">{REGION_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
        </div>
        <div className="mt-4"><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Excerpt</label><textarea rows={3} value={postForm.excerpt} onChange={(event) => setPostForm((previous) => ({ ...previous, excerpt: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" /></div>
        <div className="mt-4"><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Body</label><textarea rows={10} value={postForm.body} onChange={(event) => setPostForm((previous) => ({ ...previous, body: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" /></div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <div className="flex h-48 items-center justify-center overflow-hidden rounded-xl bg-white">
              {postForm.image ? <img src={postForm.image} alt="Preview posting" className="h-full w-full object-cover" /> : <div className="text-center text-slate-400"><ImageIcon className="mx-auto h-8 w-8" /><p className="mt-2 text-sm">Belum ada image</p></div>}
            </div>
            <input ref={postImageRef} type="file" accept="image/*" className="hidden" onChange={handlePostImage} />
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => postImageRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-black"><ImageIcon className="h-4 w-4" /> Pilih image</button>
              <button type="button" onClick={() => setPostForm((previous) => ({ ...previous, image: null, namaimage: "" }))} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Trash2 className="h-4 w-4" /> Remove image</button>
            </div>
          </div>
          <div className="grid gap-4">
            <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Nama Image</label><input value={postForm.namaimage} onChange={(event) => setPostForm((previous) => ({ ...previous, namaimage: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
            <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Figcaption</label><textarea rows={5} value={postForm.figcaption} onChange={(event) => setPostForm((previous) => ({ ...previous, figcaption: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" /></div>
          </div>
        </div>
      </div>
    );

  const pageSection =
    pageMode === "list" ? (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>Halaman Website</h3>
            <p className="mt-1 text-sm text-slate-500">Mengikuti jalur `newpage`, `editpage`, dan `viewpage` pada blueprint lama.</p>
          </div>
          <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input value={pageSearch} onChange={(event) => setPageSearch(event.target.value)} placeholder="Cari halaman..." className="w-64 bg-transparent outline-none" />
          </label>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-3"><input type="checkbox" checked={filteredPages.length > 0 && selectedPageIds.length === filteredPages.length} onChange={(event) => setSelectedPageIds(event.target.checked ? filteredPages.map((item) => item.id) : [])} /></th>
                <th className="px-3 py-3">Judul</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Update</th>
                <th className="px-3 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3"><input type="checkbox" checked={selectedPageIds.includes(item.id)} onChange={(event) => setSelectedPageIds((previous) => event.target.checked ? [...new Set([...previous, item.id])] : previous.filter((value) => value !== item.id))} /></td>
                  <td className="px-3 py-3"><p className="text-slate-900" style={{ fontWeight: 600 }}>{item.judul}</p><p className="mt-1 text-xs text-slate-500">{item.excerpt}</p></td>
                  <td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-xs ${item.status === "published" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{item.status}</span></td>
                  <td className="px-3 py-3">{item.updated_at}</td>
                  <td className="px-3 py-3"><div className="flex justify-end gap-2"><button type="button" onClick={() => { setActivePageId(item.id); setPageMode("detail"); }} className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"><Eye className="h-4 w-4" /></button><button type="button" onClick={() => openEditPage(item)} className="rounded-lg bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"><Edit className="h-4 w-4" /></button><button type="button" onClick={() => deletePages([item.id])} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : pageMode === "detail" && activePage ? (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <button type="button" onClick={() => setPageMode("list")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"><ChevronLeft className="h-4 w-4" /> Back</button>
        <h2 className="mt-4 text-2xl text-slate-900" style={{ fontWeight: 700 }}>{activePage.judul}</h2>
        <p className="mt-2 text-sm text-slate-500">{activePage.excerpt}</p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 whitespace-pre-wrap text-sm text-slate-700">{activePage.body}</div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => openEditPage(activePage)} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]"><Edit className="h-4 w-4" /> Edit</button>
          <button type="button" onClick={() => deletePages([activePage.id])} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Trash2 className="h-4 w-4" /> Delete</button>
        </div>
      </div>
    ) : (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => setPageMode("list")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"><ChevronLeft className="h-4 w-4" /> Back</button>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setPageForm(activePageId && activePage ? { judul: activePage.judul, excerpt: activePage.excerpt, body: activePage.body } : createEmptyPage())} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><RotateCcw className="h-4 w-4" /> Reset</button>
            <button type="button" onClick={savePage} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]"><Save className="h-4 w-4" /> Simpan</button>
          </div>
        </div>
        <div className="mt-5 grid gap-4">
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Judul</label><input value={pageForm.judul} onChange={(event) => setPageForm((previous) => ({ ...previous, judul: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Excerpt</label><textarea rows={4} value={pageForm.excerpt} onChange={(event) => setPageForm((previous) => ({ ...previous, excerpt: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Body</label><textarea rows={12} value={pageForm.body} onChange={(event) => setPageForm((previous) => ({ ...previous, body: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" /></div>
        </div>
      </div>
    );

  const categorySection = (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div><h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>Kategori</h3><p className="mt-1 text-sm text-slate-500">Pattern bulk CRUD table untuk kategori website.</p></div>
          <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-500"><Search className="h-4 w-4" /><input value={categorySearch} onChange={(event) => setCategorySearch(event.target.value)} placeholder="Cari kategori..." className="w-56 bg-transparent outline-none" /></label>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr><th className="px-3 py-3"><input type="checkbox" checked={filteredCategories.length > 0 && selectedCategoryIds.length === filteredCategories.length} onChange={(event) => setSelectedCategoryIds(event.target.checked ? filteredCategories.map((item) => item.id) : [])} /></th><th className="px-3 py-3">Nama</th><th className="px-3 py-3">Slug</th><th className="px-3 py-3 text-right">Aksi</th></tr>
            </thead>
            <tbody>
              {filteredCategories.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3"><input type="checkbox" checked={selectedCategoryIds.includes(item.id)} onChange={(event) => setSelectedCategoryIds((previous) => event.target.checked ? [...new Set([...previous, item.id])] : previous.filter((value) => value !== item.id))} /></td>
                  <td className="px-3 py-3">{item.nama}</td>
                  <td className="px-3 py-3">{item.slug}</td>
                  <td className="px-3 py-3"><div className="flex justify-end gap-2"><button type="button" onClick={() => { setEditingCategoryId(item.id); setCategoryForm({ nama: item.nama, slug: item.slug }); }} className="rounded-lg bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"><Edit className="h-4 w-4" /></button><button type="button" onClick={() => deleteCategories([item.id])} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>{editingCategoryId ? "Edit Kategori" : "Tambah Kategori"}</h3>
        <div className="mt-4 space-y-4">
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Nama</label><input value={categoryForm.nama} onChange={(event) => setCategoryForm((previous) => ({ ...previous, nama: event.target.value, slug: previous.slug || slugify(event.target.value) }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Slug</label><input value={categoryForm.slug} onChange={(event) => setCategoryForm((previous) => ({ ...previous, slug: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
        </div>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={() => { setEditingCategoryId(null); setCategoryForm(createEmptyCategory()); }} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><RotateCcw className="h-4 w-4" /> Reset</button>
          <button type="button" onClick={saveCategory} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]"><Save className="h-4 w-4" /> Submit</button>
        </div>
      </div>
    </div>
  );

  const gallerySection = (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div><h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>Galeri</h3><p className="mt-1 text-sm text-slate-500">CRUD galeri React sesuai entry administrasi website.</p></div>
          <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-500"><Search className="h-4 w-4" /><input value={gallerySearch} onChange={(event) => setGallerySearch(event.target.value)} placeholder="Cari galeri..." className="w-56 bg-transparent outline-none" /></label>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr><th className="px-3 py-3"><input type="checkbox" checked={filteredGalleries.length > 0 && selectedGalleryIds.length === filteredGalleries.length} onChange={(event) => setSelectedGalleryIds(event.target.checked ? filteredGalleries.map((item) => item.id) : [])} /></th><th className="px-3 py-3">Nama</th><th className="px-3 py-3">Tanggal</th><th className="px-3 py-3 text-right">Aksi</th></tr>
            </thead>
            <tbody>
              {filteredGalleries.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3"><input type="checkbox" checked={selectedGalleryIds.includes(item.id)} onChange={(event) => setSelectedGalleryIds((previous) => event.target.checked ? [...new Set([...previous, item.id])] : previous.filter((value) => value !== item.id))} /></td>
                  <td className="px-3 py-3"><p className="text-slate-900" style={{ fontWeight: 600 }}>{item.nama}</p><p className="mt-1 text-xs text-slate-500">{item.deskripsi}</p></td>
                  <td className="px-3 py-3">{item.tanggal}</td>
                  <td className="px-3 py-3"><div className="flex justify-end gap-2"><button type="button" onClick={() => { setEditingGalleryId(item.id); setGalleryForm({ nama: item.nama, deskripsi: item.deskripsi, tanggal: item.tanggal, coverImage: item.coverImage }); }} className="rounded-lg bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"><Edit className="h-4 w-4" /></button><button type="button" onClick={() => deleteGalleries([item.id])} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>{editingGalleryId ? "Edit Galeri" : "Tambah Galeri"}</h3>
        <div className="mt-4 space-y-4">
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Nama</label><input value={galleryForm.nama} onChange={(event) => setGalleryForm((previous) => ({ ...previous, nama: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Tanggal</label><input type="date" value={galleryForm.tanggal} onChange={(event) => setGalleryForm((previous) => ({ ...previous, tanggal: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Deskripsi</label><textarea rows={5} value={galleryForm.deskripsi} onChange={(event) => setGalleryForm((previous) => ({ ...previous, deskripsi: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" /></div>
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl bg-white">
              {galleryForm.coverImage ? <img src={galleryForm.coverImage} alt="Preview galeri" className="h-full w-full object-cover" /> : <div className="text-center text-slate-400"><ImageIcon className="mx-auto h-8 w-8" /><p className="mt-2 text-sm">Belum ada cover image</p></div>}
            </div>
            <input ref={galleryImageRef} type="file" accept="image/*" className="hidden" onChange={handleGalleryImage} />
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => galleryImageRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-black"><ImageIcon className="h-4 w-4" /> Pilih image</button>
              <button type="button" onClick={() => setGalleryForm((previous) => ({ ...previous, coverImage: null }))} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Trash2 className="h-4 w-4" /> Remove image</button>
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={() => { setEditingGalleryId(null); setGalleryForm(createEmptyGallery()); }} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><RotateCcw className="h-4 w-4" /> Reset</button>
          <button type="button" onClick={saveGallery} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]"><Save className="h-4 w-4" /> Submit</button>
        </div>
      </div>
    </div>
  );

  return (
    <PageWrapper
      title="Website"
      subtitle="Administrasi website super admin full React mengikuti blueprint lama."
      breadcrumbs={[{ label: "Administrasi" }, { label: "Website" }]}
      actions={topActions}
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => changeTab(tab.key)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors ${active ? "bg-[#E30613] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "posting" ? postingSection : activeTab === "halaman" ? pageSection : activeTab === "kategori" ? categorySection : gallerySection}

        {toast ? (
          <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-green-700 shadow-lg">
            <FileText className="h-4 w-4" />
            <span className="text-sm" style={{ fontWeight: 500 }}>{toast}</span>
          </div>
        ) : null}
      </div>

      <ConfirmModal
        isOpen={confirm.isOpen}
        onClose={() => setConfirm((previous) => ({ ...previous, isOpen: false }))}
        onConfirm={confirm.onConfirm}
        title={confirm.title}
        message={confirm.message}
        confirmLabel={confirm.confirmLabel}
        variant="danger"
      />
    </PageWrapper>
  );
}
