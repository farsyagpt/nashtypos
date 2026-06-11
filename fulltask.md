# NASHTY OS — Product Requirements Document

**Versi:** 1.0
**Tanggal:** Juni 2026
**Status:** Draft untuk Review
**Penyusun:** CafeMargin × Nashty Hot Chicken

---

## 1. Project Overview

### 1.1 Nama Project
NASHTY OS — Sistem Operasional Restoran Terintegrasi

### 1.2 Ringkasan Project
NASHTY OS adalah platform manajemen operasional restoran berbasis web yang terdiri dari empat modul terintegrasi: POS Terminal, Kitchen Display System (KDS), Backoffice, dan CRM (integrasi dengan NashtyPeople yang sudah live). Keempat modul berbagi satu backend: **Express.js API** yang terhubung ke **Supabase** (PostgreSQL + Auth + Storage + Realtime).

### 1.3 Latar Belakang
Nashty Hot Chicken membutuhkan sistem operasional terpadu yang menggantikan proses manual atau sistem terpisah-pisah. Sistem ini dirancang untuk mengakomodasi operasional outlet restoran dengan multiple tipe order (dine-in, take away, delivery platform) dan kebutuhan manajemen pelanggan berbasis loyalitas.

### 1.4 Tujuan Utama
- Menyediakan alur transaksi kasir yang cepat dan andal, termasuk dalam kondisi offline
- Menampilkan antrean order ke dapur secara realtime dengan indikator prioritas waktu
- Memberikan owner dan manager visibilitas penuh terhadap performa bisnis melalui laporan dan analytics
- Membangun ekosistem loyalitas pelanggan yang terintegrasi langsung dengan transaksi POS

---

## 2. Problem Statement

### 2.1 Masalah yang Ingin Diselesaikan
- Tidak ada sistem kasir yang terintegrasi dengan dapur, menyebabkan miskomunikasi order
- Tidak ada visibilitas realtime terhadap waktu pengerjaan order dapur
- Manajemen menu, staf, dan laporan dilakukan secara manual atau terpisah
- Program loyalitas pelanggan tidak terhubung langsung ke transaksi kasir

### 2.2 Pain Point Pengguna
- **Kasir:** Proses input order lambat, tidak ada konfirmasi dari dapur bahwa order selesai
- **Staf Dapur:** Tidak ada tampilan antrean yang terstruktur, order sering terlewat atau salah urutan
- **Owner/Manager:** Tidak bisa melihat laporan penjualan secara real-time, data tersebar
- **Pelanggan:** Tidak ada transparansi poin loyalitas dan reward yang bisa diperoleh

### 2.3 Opportunity
Dengan sistem terintegrasi, Nashty Hot Chicken dapat meningkatkan kecepatan layanan, mengurangi human error, dan membangun hubungan pelanggan jangka panjang melalui program loyalitas yang terdata.

---

## 3. Goals & Success Metrics

### 3.1 Business Goals
- Mengurangi waktu rata-rata pengerjaan order dapur menjadi terukur per kategori menu
- Meningkatkan repeat customer rate melalui program loyalitas NashtyPeople
- Memberikan owner akses laporan penjualan kapan saja tanpa perlu kehadiran fisik

### 3.2 User Goals
- Kasir dapat memproses transaksi lengkap (termasuk modifier, diskon, dan pembayaran) dalam waktu singkat
- Staf dapur tidak perlu komunikasi verbal untuk menerima dan mengonfirmasi order
- Owner dapat melihat performa outlet hari ini vs kemarin dari perangkat mana saja

### 3.3 Indikator Keberhasilan (UAT)
- Sistem mampu memproses minimal 100 transaksi simulasi tanpa error kritikal
- KDS menerima order baru dari POS dalam waktu kurang dari 3 detik
- CRUD menu di Backoffice tersinkronisasi ke POS secara realtime
- Poin pelanggan terupdate otomatis setelah transaksi di POS
- Laporan harian POS menampilkan ringkasan yang akurat per shift
- Halaman member publik dapat diakses via nomor telepon pelanggan

---

## 4. Target Users

### 4.1 User Persona & Role

| Role | Platform Utama | Deskripsi |
|---|---|---|
| **Kasir** | POS Terminal (tablet/desktop) | Staf yang memproses transaksi sehari-hari. Akses terbatas pada fitur kasir. |
| **Chef / Staf Dapur** | KDS (monitor dapur) | Melihat dan mengelola antrean order. Tidak perlu login dengan akun terpisah dari sistem. |
| **Manager** | POS, Backoffice, CRM | Supervisor operasional. Akses ke semua fitur kecuali manajemen akun Owner. |
| **Owner** | Backoffice, CRM | Full access ke semua modul dan konfigurasi sistem. |
| **Pelanggan** | Member Landing Page (/member) | Pengguna akhir yang melihat poin dan reward loyalitas via browser, tanpa login akun. |

### 4.2 Hak Akses Secara Umum

| Fitur | Kasir | Manager | Owner |
|---|---|---|---|
| POS — Transaksi | ✅ | ✅ | ✅ |
| POS — Void (perlu konfirmasi PIN Manager) | ❌ eksekusi | ✅ konfirmasi | ✅ konfirmasi |
| POS — Laporan Harian Shift | ✅ | ✅ | ✅ |
| KDS | ✅ (view + aksi) | ✅ | ✅ |
| Backoffice — Dashboard & Laporan | ❌ | ✅ | ✅ |
| Backoffice — Menu Management | ❌ | ✅ | ✅ |
| Backoffice — Tim (CRUD Kasir/Manager) | ❌ | ✅ | ✅ |
| Backoffice — Tim (CRUD Owner) | ❌ | ❌ | ✅ |
| Backoffice — Konfigurasi Outlet | ❌ | ✅ | ✅ |
| CRM — NashtyPeople | ❌ | ✅ | ✅ |
| CRM — Konfigurasi Segmen | ❌ | ✅ | ✅ |

**Aturan multi-outlet untuk Kasir:** Kasir hanya dapat login pada outlet di mana akun mereka di-assign. Login di outlet lain tidak diizinkan.

---

## 5. Scope

### 5.1 In Scope

**Modul 1 — POS Terminal**
- Login berbasis PIN per staf dengan tampilan kartu staf
- Auto-logout setelah idle (durasi configurable dari Backoffice)
- Input order: grid menu per kategori, pencarian menu, modifier (required & optional)
- 5 tipe order: Dine In (dengan input nomor meja), Take Away, GoFood, GrabFood, ShopeeFood
- Cart realtime: tambah/kurang/hapus item, catatan per item
- Diskon (nominal atau persentase), lookup member by nomor telepon, kalkulasi poin otomatis
- Kalkulasi otomatis: subtotal, pajak (PPN), service charge, diskon, total
- 8 metode pembayaran: Tunai, Transfer, QRIS, BCA, Debit, GoFood, GrabFood, ShopeeFood (toggle aktif/nonaktif dari Backoffice)
- Support split payment (kombinasi beberapa metode)
- Kalkulasi kembalian untuk pembayaran tunai
- Void transaksi (butuh konfirmasi PIN Manager, dicatat di laporan)
- Laporan harian per shift: ringkasan penjualan, breakdown per metode pembayaran, export PDF
- Mode offline: order tersimpan lokal dan disinkronisasi ke server saat koneksi pulih
- Notifikasi overlay saat order dari dapur selesai diproses chef
- Manajemen shift: buka dan tutup shift, rekap per shift
- Cetak struk via Bluetooth printer (ESC/POS)

**Modul 2 — Kitchen Display System (KDS)**
- Tampilan antrean order realtime dari POS
- Setiap order card menampilkan: nomor order, tipe order, nama meja (jika Dine In), live timer (MM:SS), daftar item beserta modifier dan catatan
- Indikator warna urgency berdasarkan waktu: Hijau (normal), Kuning (warning), Merah (overdue/urgent)
- Threshold waktu warning dan overdue configurable per kategori menu dari Backoffice
- Auto-sort antrean: Urgent → Warning → Normal, lalu by waktu masuk (terlama di atas)
- Filter order: Semua, Dine In, Take Away, Delivery (GoFood+GrabFood+Shopee)
- Strip urgent sticky di bagian atas saat ada order overdue
- Badge "NEW" + animasi saat order baru masuk
- Catatan per item ditampilkan dengan highlight visual agar tidak terlewat
- Swipe to Complete: gesture drag untuk menyelesaikan order (anti-accidental tap)
- Setelah swipe: notifikasi overlay muncul di POS, order hanya diarsipkan setelah kasir konfirmasi
- Toggle Day/Dark mode; default Dark; konfigurasi default per outlet bisa diset dari Backoffice
- Compact mode otomatis aktif saat antrean melebihi threshold
- Audio: bunyi single saat order baru masuk, double-ding saat order selesai, alert saat overdue
- Konfigurasi display per device (font scale, card width, toggle audio) tersimpan lokal

**Modul 3 — Backoffice**
- Dashboard: KPI hari ini (revenue, jumlah transaksi, AOV, void & refund), grafik revenue 7 hari, top 5 produk, breakdown metode pembayaran
- Menu Management: CRUD kategori, CRUD produk (nama, kategori, harga, status, foto, stasiun, outlet availability), CRUD modifier group (tipe pilih-1/multi, opsi dengan harga tambahan), duplikat dan arsip produk
- Laporan Analytics: gross sales, diskon, refund, net sales, pajak, service charge, total collected — dengan filter periode fleksibel (hari ini, 7 hari, 30 hari, kustom); laporan per item, per kategori, per modifier; breakdown per platform delivery
- Menu Engineering: matrix Stars / Plowhorses / Puzzles / Dogs berdasarkan popularitas dan margin
- Inventori: CRUD bahan baku, alert low stock, pengurangan stok otomatis saat order diproses
- Pengaturan POS: nama outlet, logo, durasi auto-logout, toggle metode pembayaran, konfigurasi konten struk, pajak (%), service charge (%, label, toggle)
- Pengaturan KDS: production time per kategori, threshold warning/overdue, toggle audio alert, compact threshold, auto-sort, default display mode
- KDS Analytics: rata-rata waktu pengerjaan per kategori, jumlah order overdue
- Manajemen Tim: CRUD Owner (Owner only), CRUD Manager, CRUD Kasir (nama, PIN, status, assign ke outlet)
- Multi-outlet: CRUD outlet, switcher outlet di sidebar (data di-scope per outlet aktif)
- Activity Logs: riwayat aksi penting (login POS, void, perubahan menu, perubahan konfigurasi, penambahan user) dengan timestamp dan user
- Export laporan ke CSV

**Modul 4 — CRM (Integrasi NashtyPeople)**

> **Catatan:** NashtyPeople CRM sudah live dan berjalan secara independen. Modul ini adalah **integrasi POS ↔ NashtyPeople**, bukan pembangunan CRM dari nol. Fitur-fitur berikut mencerminkan surface area integrasi yang diimplementasikan dalam proyek ini:

- Dashboard CRM: KPI (member baru hari ini, total member, total revenue dari member, repeat customer count, repeat rate, average spending), top spender, snapshot segmen
- Manajemen Pelanggan: database pelanggan dengan filter per segmen; profil per pelanggan (poin aktif, histori transaksi, data kunjungan); tambah transaksi manual
- Log Transaksi: semua transaksi member dengan filter periode
- Analitik CRM: grafik revenue harian dari member, pertumbuhan member, ranking top spender
- Rewards: CRUD reward (nama, deskripsi, poin dibutuhkan, status, tanggal kadaluarsa opsional, kuota, hari berlaku); flow penukaran poin
- Sistem Poin: kalkulasi otomatis saat transaksi POS; poin hangus jika tidak digunakan dalam 1 tahun; riwayat earn/redeem per pelanggan
- Konfigurasi Segmen: CRUD tier dinamis (nama, warna, min_visits); perubahan otomatis memperbarui seluruh data pelanggan
- Kelola Halaman Member: konfigurasi URL, announcement, poster carousel; daftar reward aktif tampil di halaman publik
- Export data pelanggan ke Excel/PDF; Import data pelanggan dari Excel
- Member Landing Page (`/member`): halaman publik tanpa login, akses via nomor telepon, tampilkan poin, tier, histori transaksi terbaru, daftar reward tersedia; mobile-first

### 5.2 Out of Scope

- Desain UI/UX (mockup dan wireframe sudah tersedia sebagai acuan)
- Hardware: tablet, printer struk, monitor KDS
- Domain dan hosting (dikelola oleh klien)
- Integrasi payment gateway pihak ketiga di luar 8 metode yang didefinisikan
- Training dan onboarding staf Nashty
- Pembuatan akun Supabase, Cloudflare, atau layanan pihak ketiga atas nama klien
- Fitur broadcast/blast promosi via push notification atau email
- Laporan keuangan level akuntansi (laba rugi, neraca)

---

## 6. User Flow

### 6.1 POS — Alur Transaksi Lengkap
1. Kasir membuka POS → tampil halaman login kartu staf
2. Kasir memilih kartunya → input PIN 4 digit → berhasil masuk ke layar kasir
3. Sistem cek shift aktif → jika belum ada, tampil modal buka shift → kasir buka shift
4. Kasir memilih tipe order (Dine In / Take Away / GoFood / GrabFood / ShopeeFood)
5. Untuk Dine In: kasir input nomor meja
6. Kasir pilih item dari grid menu (per kategori / via search)
7. Jika item memiliki required modifier → modal modifier muncul → kasir wajib memilih sebelum bisa tambah ke cart
8. Optional add-on dapat dipilih atau dilewati
9. Item masuk ke cart; kasir dapat mengubah quantity atau hapus item; dapat menambahkan catatan per item
10. Kasir opsional: search member by nomor telepon → jika ditemukan, poin tersedia untuk digunakan sebagai diskon
11. Kasir opsional: input diskon (nominal/%) → jika melebihi batas, butuh konfirmasi PIN Manager
12. Kasir tap "Bayar" → modal pembayaran muncul
13. Kasir pilih metode pembayaran; untuk Tunai input jumlah uang diterima → kembalian tampil otomatis; untuk Delivery input nomor order platform
14. Kasir konfirmasi pembayaran → order dibuat → KDS menerima order secara realtime
15. Struk dicetak via Bluetooth printer
16. Poin pelanggan (jika member) diperbarui otomatis
17. Kasir dapat melihat riwayat transaksi shift; void tersedia dengan konfirmasi PIN Manager

### 6.2 KDS — Alur Chef Memproses Order
1. Chef melihat halaman KDS (fullscreen, dark mode default)
2. Order baru masuk → badge "NEW" dan bunyi notifikasi muncul
3. Chef melihat card order: nomor order, tipe, nama meja, timer berjalan, list item + modifier + catatan
4. Chef mengerjakan order; dapat mencentang per item sebagai selesai (progress bar update)
5. Jika order mendekati batas waktu → warna timer berubah Kuning → Merah jika overdue
6. Setelah semua selesai, chef swipe kartu ke kanan untuk menandai order selesai
7. Overlay muncul di layar POS kasir: ringkasan order selesai
8. Kasir konfirmasi di POS overlay → order diarsipkan ke completed list

### 6.3 Backoffice — Alur Owner Melihat Laporan
1. Owner buka Backoffice via browser desktop
2. Login dengan email + password
3. Pilih outlet dari OutletSwitcher di sidebar (data ter-scope per outlet)
4. Dashboard menampilkan KPI hari ini secara langsung
5. Owner navigasi ke Laporan Analytics untuk filter periode lebih fleksibel
6. Owner dapat filter per tanggal, kategori, atau metode pembayaran
7. Export ke CSV jika dibutuhkan

### 6.4 CRM — Alur Penukaran Reward
1. Staff buka modul CRM
2. Search pelanggan by nama atau nomor telepon
3. Buka profil pelanggan → lihat saldo poin aktif
4. Pilih reward dari katalog yang tersedia
5. Konfirmasi penukaran → saldo poin berkurang → riwayat redemption tercatat

### 6.5 Member — Alur Pelanggan Cek Poin
1. Pelanggan buka URL halaman member (`/member`) via smartphone
2. Input nomor telepon → sistem cari data di database
3. Jika ditemukan: tampil nama, tier, saldo poin, riwayat transaksi terbaru, daftar reward tersedia
4. Jika tidak ditemukan: tampil pesan ramah dan informasi cara bergabung

---

## 7. User Stories

### 7.1 POS Terminal

**Login & Sesi**
- Sebagai kasir, saya ingin memilih kartu nama saya dan input PIN, agar saya bisa masuk ke sistem dengan cepat tanpa perlu mengetik username
  - AC: Kartu staf tampil dalam grid; PIN 4 digit; tombol konfirmasi aktif hanya saat 4 digit terisi; login gagal jika PIN salah
- Sebagai sistem, saya ingin otomatis logout kasir setelah idle selama durasi yang dikonfigurasi, agar sesi tidak terbuka tanpa pengawasan
  - AC: Timer idle reset setiap ada interaksi; setelah timeout, kembali ke halaman login kartu staf

**Transaksi**
- Sebagai kasir, saya ingin memilih item dari grid menu yang terkategori dengan baik, agar saya bisa input order dengan cepat
  - AC: Tab kategori tersedia (Favorit, Makanan, Minuman, Camilan, Dessert, Add On); search menu berfungsi realtime; hanya item aktif yang tampil
- Sebagai kasir, saya ingin modal modifier muncul otomatis saat memilih item yang memiliki modifier wajib, agar saya tidak lupa menentukan pilihan sebelum order masuk
  - AC: Modal otomatis muncul; required modifier harus dipilih sebelum tombol "Tambah" aktif; optional add-on bisa dilewati
- Sebagai kasir, saya ingin cart terupdate realtime saat saya mengubah quantity item, agar saya selalu melihat total terkini
  - AC: Subtotal, pajak, service charge, diskon, dan total terupdate otomatis setiap perubahan
- Sebagai kasir, saya ingin bisa mencari dan memilih member saat transaksi, agar poin pelanggan bisa otomatis ter-apply
  - AC: Search by nomor telepon; jika member ditemukan, poin tersedia ditampilkan; poin bisa digunakan sebagai potongan harga
- Sebagai kasir, saya ingin input nominal uang diterima untuk pembayaran tunai, agar kembalian dihitung otomatis
  - AC: Numpad aktif; shortcut nominal (+50K, +100K, +200K, Pas); kembalian tampil secara realtime
- Sebagai kasir, saya ingin bisa split pembayaran dengan lebih dari satu metode, agar fleksibel untuk pelanggan yang membayar kombinasi
  - AC: Bisa tambah metode pembayaran; tombol Bayar aktif hanya jika total pembayaran ≥ total order
- Sebagai manager, saya ingin konfirmasi PIN sebelum void bisa dieksekusi, agar tidak ada void yang tidak sengaja atau tidak sah
  - AC: Modal PIN muncul saat kasir request void; hanya PIN dengan role Manager/Owner yang diterima; void dicatat di laporan dengan alasan dan user yang mengeksekusi

**Laporan Shift**
- Sebagai kasir/manager, saya ingin melihat laporan ringkasan shift saya, agar saya tahu performa transaksi selama shift berjalan
  - AC: Tampil gross sales, diskon, refund, net sales, pajak, service charge, total collected; breakdown per metode pembayaran; bisa export ke PDF

### 7.2 KDS

- Sebagai chef, saya ingin melihat semua order aktif dalam satu layar yang terbaca dari jarak 2–3 meter, agar saya bisa bekerja tanpa harus mendekati layar setiap saat
  - AC: Nomor order besar dan bold; font minimum 18px; card berisi item lengkap dengan modifier dan catatan
- Sebagai chef, saya ingin timer berjalan per detik dengan perubahan warna yang jelas, agar saya tahu order mana yang harus diprioritaskan
  - AC: Hijau = normal; Kuning = mendekati batas; Merah = overdue; threshold bisa diatur dari Backoffice
- Sebagai chef, saya ingin catatan khusus per item tampil dengan visual berbeda, agar saya tidak melewatkan instruksi penting
  - AC: Background kuning, border oranye, ikon peringatan pada catatan item
- Sebagai chef, saya ingin swipe kartu untuk menandai order selesai dan tidak bisa melakukannya secara tidak sengaja dengan tap, agar tidak ada order yang ter-complete secara keliru
  - AC: Harus drag hingga ≥90% lebar track; tap biasa tidak trigger complete
- Sebagai chef, saya ingin bekerja dalam mode gelap sebagai default, agar layar tidak menyilaukan di lingkungan dapur
  - AC: Default dark mode; toggle day/night tersedia; default bisa diset dari Backoffice per outlet

### 7.3 Backoffice

- Sebagai owner, saya ingin melihat KPI bisnis hari ini di halaman utama Backoffice, agar saya tidak perlu mencari-cari data setiap pagi
  - AC: Revenue hari ini, total transaksi, AOV, void & refund — semua dengan % perubahan vs periode sebelumnya
- Sebagai owner/manager, saya ingin menambah, mengubah, dan menonaktifkan item menu tanpa harus ke outlet, agar perubahan menu bisa dilakukan kapan saja
  - AC: CRUD menu realtime tersinkronisasi ke POS; item nonaktif tidak tampil di POS; foto bisa diupload (JPG/PNG, maks 2MB)
- Sebagai owner, saya ingin melihat laporan dengan filter periode yang fleksibel, agar saya bisa bandingkan performa mingguan, bulanan, atau antar periode custom
  - AC: Filter: hari ini, 7 hari, 30 hari, bulan ini, custom; tampil per item, per kategori, per modifier, per platform
- Sebagai owner, saya ingin melihat Activity Log untuk semua aksi penting di sistem, agar ada audit trail jika terjadi masalah
  - AC: Tercatat: login POS, void, perubahan menu, perubahan konfigurasi, penambahan user; setiap log ada timestamp dan user
- Sebagai owner, saya ingin mengatur threshold waktu warning dan overdue KDS per kategori menu, agar timer KDS sesuai dengan realita waktu masak
  - AC: Bisa set menit warning dan overdue per kategori; perubahan terefleksi di KDS dalam < 30 detik

### 7.4 CRM

- Sebagai staff CRM, saya ingin melihat profil lengkap pelanggan termasuk riwayat transaksi dan saldo poin, agar saya bisa memberikan layanan personal
  - AC: Tampil nama, nomor telepon, tier, total spending, jumlah kunjungan, saldo poin, tanggal kadaluarsa poin, riwayat transaksi lengkap
- Sebagai owner, saya ingin mengkonfigurasi tier segmen pelanggan secara dinamis, agar segmentasi bisa disesuaikan dengan strategi bisnis yang berubah
  - AC: Bisa tambah/edit/hapus tier (min. 2 tier harus ada); setiap perubahan otomatis recalculate semua pelanggan; setiap tier punya nama, warna, dan minimum kunjungan
- Sebagai pelanggan, saya ingin mengecek poin saya via browser smartphone tanpa perlu install app, agar mudah diakses kapan saja
  - AC: Halaman publik `/member`; input nomor telepon; tampil saldo poin, tier, histori transaksi terbaru, daftar reward tersedia; mobile-friendly

---

## 8. Functional Requirements

### 8.1 Modul POS — Login & Autentikasi

| ID | Fitur | Deskripsi | Input | Output | Validasi | Kondisi Sukses | Kondisi Gagal |
|---|---|---|---|---|---|---|---|
| P-01 | Staff Card Grid | Grid 2–6 kartu staf per outlet | Tap kartu | Modal PIN terbuka | Hanya staf aktif yang tampil | Modal PIN muncul | Kartu nonaktif tidak tampil |
| P-02 | PIN Input | Input PIN 4 digit | 4 digit angka | Login berhasil atau pesan error | PIN wajib 4 digit; tombol konfirmasi aktif hanya saat 4 digit terisi | Masuk ke layar kasir | Pesan "PIN salah"; lockout setelah 3 percobaan gagal (5 menit) |
| P-03 | Role Detection | Sistem deteksi role saat login | PIN valid | Akses sesuai role | — | Manager mendapat akses void & laporan; kasir biasa tidak | — |
| P-04 | Auto-logout | Logout otomatis setelah idle | Tidak ada interaksi selama N menit | Kembali ke halaman login kartu | Durasi N configurable dari Backoffice | Halaman login tampil | — |

### 8.2 Modul POS — Menu & Cart

| ID | Fitur | Deskripsi | Input | Output | Validasi | Kondisi Sukses | Kondisi Gagal |
|---|---|---|---|---|---|---|---|
| P-05 | Menu Grid | Tampilan grid item menu per kategori | Tap kategori / search | Item menu tersaring | Hanya item aktif tampil | Grid update sesuai filter | Item inactive tidak tampil |
| P-06 | Modifier Modal | Modal pilihan modifier muncul untuk item dengan required modifier | Tap item dengan modifier | Modal dengan opsi modifier | Required modifier wajib dipilih; tombol "Tambah" disabled sebelum required terpenuhi | Item + modifier masuk cart | Tidak bisa tambah cart jika required modifier belum dipilih |
| P-07 | Cart Management | Kelola item dalam cart | Ubah qty, hapus item, tambah catatan | Cart terupdate | Qty minimum 1 (hapus jika 0) | Cart dan running total terupdate realtime | — |
| P-08 | Tipe Order | Pilih tipe order dan input meja | Pilih tipe; input nomor meja untuk Dine In | Tipe order tersimpan di cart | Nomor meja required untuk Dine In | Order type tersimpan | — |
| P-09 | Member Lookup | Cari member by nomor telepon | Nomor telepon | Data member + saldo poin | Format nomor telepon valid | Member ditemukan, poin dapat digunakan | Member tidak ditemukan: pesan ramah, bisa lanjut tanpa member |
| P-10 | Diskon | Input diskon nominal atau persentase | Nilai diskon | Running total terupdate | Diskon tidak melebihi subtotal; jika melebihi batas konfigurasi → butuh PIN Manager | Diskon terapply ke cart | PIN Manager salah: diskon tidak terapply |
| P-11 | Running Total | Kalkulasi realtime semua komponen harga | Perubahan cart | Subtotal, pajak, service charge, diskon, total | Service charge dan pajak mengacu konfigurasi outlet | Total akurat | — |

### 8.3 Modul POS — Pembayaran

| ID | Fitur | Deskripsi | Input | Output | Validasi | Kondisi Sukses | Kondisi Gagal |
|---|---|---|---|---|---|---|---|
| P-12 | Payment Modal | Modal pilihan metode pembayaran | Pilih metode | Layar pembayaran sesuai metode | Hanya metode aktif yang tampil | Modal terbuka | — |
| P-13 | Tunai | Pembayaran tunai dengan kalkulasi kembalian | Nominal uang diterima | Kembalian otomatis | Uang diterima ≥ total order agar bisa konfirmasi | Pembayaran dikonfirmasi | Uang kurang: tombol konfirmasi disabled |
| P-14 | Non-Tunai | Pembayaran QRIS/Transfer/Debit | Konfirmasi manual kasir | Order terbuat | — | Pembayaran dikonfirmasi | — |
| P-15 | Delivery Platform | Pembayaran via GoFood/GrabFood/ShopeeFood | Nomor order platform | Order terbuat | Nomor order platform wajib diisi | Pembayaran dikonfirmasi | Field kosong: tidak bisa konfirmasi |
| P-16 | Split Payment | Kombinasi beberapa metode pembayaran | Beberapa metode + nominal | Pembayaran dikonfirmasi | Total semua metode harus ≥ total order | Semua metode tercatat di transaksi | Total kurang: tombol Bayar disabled |
| P-17 | Konfirmasi Pembayaran | Finalisasi transaksi | Konfirmasi kasir | Order terbuat di database; KDS menerima; poin member terupdate; struk tercetak | Semua validasi sebelumnya terpenuhi | Order sukses; KDS update; struk cetak | Gagal: pesan error; order tidak dibuat |

### 8.4 Modul POS — Void & Laporan

| ID | Fitur | Deskripsi | Input | Output | Validasi | Kondisi Sukses | Kondisi Gagal |
|---|---|---|---|---|---|---|---|
| P-18 | Riwayat Transaksi | Daftar transaksi shift hari ini | — | List transaksi dengan detail | — | Semua transaksi hari ini tampil | — |
| P-19 | Void | Batalkan transaksi yang sudah terjadi | Pilih transaksi; input alasan; konfirmasi PIN Manager | Transaksi di-void; tercatat di laporan | PIN Manager valid; alasan tidak boleh kosong | Void berhasil; transaksi ditandai void; masuk catatan laporan | PIN salah: void dibatalkan |
| P-20 | Laporan Harian Shift | Ringkasan penjualan per shift | — | Gross sales, diskon, refund, net sales, pajak, service charge, total collected; breakdown per metode | — | Data akurat; bisa export PDF | — |
| P-21 | Manajemen Shift | Buka dan tutup shift | Konfirmasi buka/tutup shift | Shift aktif atau rekap shift | Transaksi hanya bisa dilakukan jika shift aktif | Shift terbuka/tertutup | Transaksi diblokir jika shift belum dibuka |

### 8.5 Modul POS — Offline Mode

| ID | Fitur | Deskripsi | Input | Output | Validasi | Kondisi Sukses | Kondisi Gagal |
|---|---|---|---|---|---|---|---|
| P-22 | Deteksi Koneksi | Indikator status koneksi | — | Banner status online/offline | — | Status tampil akurat | — |
| P-23 | Order Offline | Buat order saat tidak ada koneksi | Order normal dari kasir | Order tersimpan lokal | Format data valid | Order tersimpan; antrian sync terbentuk | — |
| P-24 | Sinkronisasi | Sync order offline ke server saat online | Koneksi pulih | Order lokal dikirim ke server | Validasi data sebelum sync; conflict resolution: last-write-wins | Order terbuat di server; antrian bersih | Data invalid: dicatat sebagai conflict; tidak dikirim |

### 8.6 Modul KDS

| ID | Fitur | Deskripsi | Input | Output | Validasi | Kondisi Sukses | Kondisi Gagal |
|---|---|---|---|---|---|---|---|
| K-01 | Order Card | Tampil kartu order dengan semua informasi | Order baru dari POS | Card tampil di KDS | — | Card berisi: nomor order, tipe, meja, timer, item+modifier+catatan | — |
| K-02 | Live Timer | Timer berjalan per detik dengan perubahan warna | Waktu berlalu | Warna berubah sesuai threshold | Threshold dari Backoffice | Hijau→Kuning→Merah sesuai konfigurasi | — |
| K-03 | Auto-Sort | Urutan otomatis berdasarkan urgency | — | Order terurut Urgent→Warning→Normal→terlama | — | Order urutan benar | — |
| K-04 | Filter Order | Filter berdasarkan tipe order | Tap filter tab | Order tersaring | — | Hanya tipe yang dipilih tampil | — |
| K-05 | Swipe Complete | Selesaikan order dengan gesture swipe | Drag thumb ke kanan ≥90% | Notifikasi di POS; order pending konfirmasi kasir | Tidak bisa trigger via tap biasa | Overlay muncul di POS | Swipe kurang dari 90%: tidak trigger |
| K-06 | POS Notify Overlay | Overlay di layar POS setelah chef swipe | Chef swipe complete | Overlay dengan ringkasan order + tombol konfirmasi | Overlay tidak bisa ditutup tanpa konfirmasi | Order diarsipkan setelah kasir konfirmasi | — |
| K-07 | NEW Badge | Animasi saat order baru masuk | Order baru | Badge + animasi 3.5 detik | — | Badge tampil kemudian menghilang otomatis | — |
| K-08 | Catatan Item | Tampilan highlight untuk catatan per item | Catatan dari kasir | Background kuning + border oranye + ikon | — | Catatan tidak terlewat | — |
| K-09 | Toggle Mode | Day/Dark mode | Tap toggle | Tampilan berganti | — | Mode berganti; tersimpan untuk sesi berikutnya | — |
| K-10 | Audio Alert | Suara notifikasi per event | Event order | Bunyi sesuai jenis event | Setting audio dari Backoffice | Suara keluar; jika audio disabled tampil visual | Browser tanpa dukungan audio API: fallback visual |

### 8.7 Modul Backoffice — Dashboard & Laporan

| ID | Fitur | Deskripsi | Input | Output | Validasi | Kondisi Sukses | Kondisi Gagal |
|---|---|---|---|---|---|---|---|
| B-01 | Dashboard KPI | Ringkasan performa hari ini | — | Revenue, transaksi, AOV, void+refund + % vs kemarin | — | Data akurat dan realtime | — |
| B-02 | Revenue Chart | Grafik revenue 7 hari terakhir | — | Line/bar chart | — | Chart tampil dengan data akurat | — |
| B-03 | Top 5 Produk | Produk terlaris hari ini | — | List 5 item dengan qty dan revenue | — | Data terurut by qty terjual | — |
| B-04 | Laporan Analytics | Laporan dengan filter periode fleksibel | Filter tanggal, kategori, metode, platform | Data tabel dan ringkasan | — | Data konsisten dengan transaksi POS | — |
| B-05 | Export CSV | Export data laporan | Klik export | File CSV terunduh | — | File berisi header dan data yang benar | — |
| B-06 | Menu Engineering | Matrix klasifikasi item menu | — | Stars/Plowhorses/Puzzles/Dogs berdasarkan popularitas dan margin | — | Semua item terklasifikasi | — |

### 8.8 Modul Backoffice — Menu Management

| ID | Fitur | Deskripsi | Input | Output | Validasi | Kondisi Sukses | Kondisi Gagal |
|---|---|---|---|---|---|---|---|
| B-07 | CRUD Kategori | Tambah/edit/hapus kategori | Form nama + urutan | Kategori tersimpan | Nama tidak boleh kosong | Kategori tampil di POS realtime | — |
| B-08 | CRUD Produk | Tambah/edit/hapus/arsip/duplikat produk | Form lengkap | Produk tersimpan | Harga > 0; foto maks 2MB (JPG/PNG) | Produk tampil/hilang di POS realtime | Foto > 2MB: ditolak dengan pesan error |
| B-09 | CRUD Modifier Group | Tambah/edit/hapus modifier group | Form nama, tipe, opsi + harga | Modifier tersimpan | Min 1 opsi per group; min_select ≤ max_select | Modifier tersedia di POS untuk item terkait | — |

### 8.9 Modul Backoffice — Pengaturan & Tim

| ID | Fitur | Deskripsi | Input | Output | Validasi | Kondisi Sukses | Kondisi Gagal |
|---|---|---|---|---|---|---|---|
| B-10 | Pengaturan POS | Konfigurasi umum POS per outlet | Form konfigurasi | Setting tersimpan | — | Perubahan terefleksi di POS dalam < 30 detik | — |
| B-11 | Pengaturan KDS | Konfigurasi production time, alert, dll | Form konfigurasi | Setting tersimpan | Threshold warning < threshold overdue | Perubahan terefleksi di KDS dalam < 30 detik | Validasi gagal: pesan error |
| B-12 | CRUD Tim | Tambah/edit/hapus user per role | Form user | User tersimpan | PIN kasir 4 digit unique per outlet; Owner hanya bisa dikelola Owner | User bisa login sesuai role | Duplikat PIN: ditolak |
| B-13 | Multi-Outlet | Kelola outlet dan switcher | CRUD outlet; pilih outlet aktif | Data ter-scope per outlet | — | Data hanya dari outlet aktif yang dipilih | — |
| B-14 | Activity Log | Lihat log aktivitas | Filter by role/action/date | Tabel log | — | Log akurat dengan timestamp dan user | — |

### 8.10 Modul CRM

| ID | Fitur | Deskripsi | Input | Output | Validasi | Kondisi Sukses | Kondisi Gagal |
|---|---|---|---|---|---|---|---|
| C-01 | Dashboard CRM | KPI loyalitas pelanggan | — | KPI, top spender, segmen snapshot | — | Data akurat | — |
| C-02 | Database Pelanggan | Daftar + filter pelanggan | Filter segmen | Tabel pelanggan | — | Data tersaring | — |
| C-03 | Profil Pelanggan | Detail per pelanggan | Pilih pelanggan | Profil lengkap + histori | — | Semua data tampil | — |
| C-04 | Tambah Transaksi Manual | Input transaksi pelanggan secara manual | Nomor struk + nominal | Poin terhitung otomatis | Nominal > 0; nomor struk tidak boleh kosong | Transaksi + poin tercatat di profil | — |
| C-05 | CRUD Reward | Kelola katalog reward | Form reward | Reward tersimpan | Poin required > 0 | Reward tampil di katalog dan halaman member | — |
| C-06 | Penukaran Reward | Tukar poin pelanggan dengan reward | Pilih pelanggan + reward | Poin dikurangi; redemption tercatat | Saldo poin ≥ poin required; reward aktif dan belum kadaluarsa; kuota tersedia | Saldo berkurang; riwayat redemption tercatat | Saldo tidak cukup: ditolak dengan pesan |
| C-07 | Konfigurasi Segmen | CRUD tier segmen dinamis | Form tier | Tier tersimpan; semua pelanggan di-recalculate | Minimal 2 tier harus ada; nama tidak boleh kosong | Segmentasi pelanggan terupdate | Hapus jika tersisa ≤ 2 tier: ditolak |
| C-08 | Export/Import | Export data pelanggan ke Excel/PDF; import dari Excel | File Excel/konfirmasi export | File terunduh / data terimport | Format file Excel valid untuk import | Data berhasil diproses | Format salah: pesan error |
| C-09 | Kelola Halaman Member | Konfigurasi tampilan halaman publik `/member` | Form konfigurasi | Setting tersimpan | — | Halaman publik terupdate | — |
| C-10 | Member Landing Page | Halaman publik cek poin pelanggan | Nomor telepon | Poin, tier, histori, reward tersedia | Nomor telepon valid | Data pelanggan tampil | Tidak ditemukan: pesan ramah |

---

## 9. Non-Functional Requirements

### 9.1 Performance
- KDS menerima order baru dari POS dalam waktu < 3 detik
- Perubahan konfigurasi dari Backoffice terefleksi di POS/KDS dalam < 30 detik
- Halaman Backoffice dan CRM memuat dalam waktu < 3 detik pada koneksi normal
- POS tetap bisa beroperasi (mode offline) tanpa koneksi internet

### 9.2 Security
- Autentikasi POS dan KDS berbasis PIN; Backoffice dan CRM berbasis email + password
- Kasir hanya dapat mengakses outlet yang di-assign; tidak ada cross-outlet access
- Void memerlukan konfirmasi PIN dari role Manager atau Owner
- Seluruh data tersimpan di backend yang dikelola klien (Supabase); tidak ada data sensitif di client-side
- API key dan credential untuk layanan pihak ketiga tidak boleh ada di client bundle — disimpan di sisi server (Express.js)

### 9.3 Accessibility
- Semua tombol interaktif memiliki ukuran minimum 44×44 piksel (standar touch target)
- Font minimum 18px pada modul KDS agar terbaca dari jarak 2–3 meter
- Semua elemen interaktif memiliki label yang dapat dibaca screen reader

### 9.4 Responsiveness
- POS Terminal: dioptimalkan untuk tablet landscape (landscape-first)
- KDS: dioptimalkan untuk monitor/TV besar, fullscreen
- Backoffice & CRM: responsif untuk desktop, tablet, dan mobile; sidebar collapse menjadi bottom nav di mobile
- Member Landing Page: mobile-first (portrait)

### 9.5 Reliability
- Sistem dapat memproses minimal 100 transaksi berturut-turut tanpa error kritikal
- Mode offline POS memastikan tidak ada data transaksi yang hilang saat koneksi terputus
- Setiap order yang gagal tersinkronisasi dicatat sebagai conflict dan dapat di-review

### 9.6 Scalability
- Arsitektur multi-outlet: data ter-scope per outlet; menambah outlet baru tidak memerlukan perubahan kode
- Tier segmen pelanggan bersifat dinamis; tidak hardcoded

---

## 10. Business Rules

### 10.1 Transaksi & Pembayaran
- Transaksi hanya bisa dilakukan jika shift aktif telah dibuka
- Total pembayaran tidak boleh kurang dari total order
- Diskon tidak boleh melebihi subtotal
- Diskon di atas batas yang dikonfigurasi memerlukan konfirmasi PIN Manager
- Void memerlukan alasan dan konfirmasi PIN Manager; void tercatat di laporan

### 10.2 Order & KDS
- Order dikirim ke KDS setelah pembayaran dikonfirmasi
- Order tidak diarsipkan dari KDS sebelum kasir mengonfirmasi overlay di POS
- Nomor order menggunakan format unik per outlet yang tidak bisa duplikat

### 10.3 Poin & Loyalitas
- Kalkulasi poin: minimum Rp 100.000 = 6 poin; +3 poin setiap tambahan Rp 50.000
- Poin hangus jika tidak digunakan dalam 1 tahun sejak diperoleh
- Penukaran reward hanya bisa dilakukan jika saldo poin ≥ poin required
- Penukaran reward hanya bisa dilakukan jika reward masih aktif, belum kadaluarsa, dan masih ada kuota

### 10.4 Segmentasi Pelanggan
- Segmen ditentukan berdasarkan jumlah kunjungan (visit_count)
- Sistem tier dinamis: tier tertinggi dengan min_visits ≤ visit_count yang berlaku
- Minimal 2 tier harus selalu ada di sistem; tidak bisa dihapus di bawah batas ini
- Perubahan konfigurasi segmen otomatis me-recalculate tier semua pelanggan yang ada

### 10.5 Akses & Multi-Outlet
- Kasir hanya bisa login di outlet yang di-assign; tidak ada akses ke outlet lain
- Data di Backoffice/CRM di-scope per outlet yang dipilih di OutletSwitcher
- Owner dapat mengelola akun Owner lain; Manager tidak bisa

### 10.6 Konfigurasi
- Toggle metode pembayaran dari Backoffice menentukan apa yang tampil di POS secara realtime
- Threshold waktu KDS (warning/overdue) berlaku per kategori menu
- Service charge dan pajak dapat dinonaktifkan per outlet

---

## 11. Edge Cases

### 11.1 POS
- Kasir memilih item saat menu sedang diupdate dari Backoffice → POS harus menampilkan versi terbaru; jika item dihapus saat sudah di cart, tampilkan notifikasi dan minta kasir untuk menghapus item tersebut
- Pelanggan memiliki poin yang sudah kadaluarsa → sistem hanya menampilkan saldo poin aktif; poin kadaluarsa tidak bisa digunakan
- Shift belum ditutup saat hari berganti → sistem mempertahankan shift aktif; owner/manager harus tutup manual
- Koneksi terputus tepat saat pembayaran dikonfirmasi → sistem harus mendeteksi apakah order sudah tersimpan di server sebelum memutuskan simpan ke offline queue atau tidak
- Dua kasir di outlet yang sama membuat order bersamaan → nomor order harus tetap unik
- Diskon yang dimasukkan melebihi subtotal → sistem membatasi maksimal diskon = subtotal

### 11.2 KDS
- Order baru masuk saat chef sedang swipe order lain → kedua aksi harus bisa berjalan bersamaan
- Koneksi terputus di KDS → tampilkan banner offline; timer tetap berjalan menggunakan data terakhir yang diterima
- Lebih dari threshold order di layar → compact mode aktif otomatis
- Chef swipe order tapi kasir tidak konfirmasi overlay di POS dalam waktu lama → order tetap dalam status "ready" sampai dikonfirmasi; tidak ada auto-archive

### 11.3 Backoffice & CRM
- Owner menghapus item menu yang sedang ada di cart POS aktif → item di cart tidak berubah; POS menampilkan notifikasi saat kasir berikutnya membuka cart
- Konfigurasi segmen diubah saat ada transaksi berjalan → recalculate dijalankan setelah transaksi selesai
- Import Excel pelanggan dengan nomor telepon duplikat → sistem menampilkan daftar duplikat dan meminta keputusan user (skip/overwrite)
- Export laporan untuk periode dengan data sangat besar → proses berjalan di background; user diberi tahu saat file siap
- Saldo poin pelanggan tepat sama dengan poin required reward → reward bisa ditukarkan (saldo ≥ required)

---

## 12. Error States

### 12.1 POS
- **Login gagal (PIN salah):** Pesan "PIN salah, coba lagi"; setelah 3 kali gagal: "Akun dikunci selama 5 menit"
- **Koneksi terputus:** Banner merah "Mode Offline — transaksi disimpan lokal"; sistem tetap bisa memproses transaksi
- **Item tidak tersedia:** Jika item dihapus saat di cart: notifikasi kuning "Item [nama] tidak lagi tersedia, harap hapus dari cart"
- **Printer tidak terhubung:** Modal error dengan opsi "Coba Lagi" atau "Lewati Cetak"
- **Pembayaran gagal:** Pesan error spesifik; order tidak dibuat; kasir bisa coba ulang

### 12.2 KDS
- **Koneksi terputus:** Banner kuning "Mode Offline — data mungkin tidak terkini"; timer tetap berjalan
- **Error Supabase Realtime:** Tampilkan pesan error; tombol "Muat Ulang"
- **Audio tidak tersedia:** Visual badge sebagai fallback

### 12.3 Backoffice & CRM
- **Query timeout:** Skeleton loader → setelah timeout: pesan "Gagal memuat data" + tombol "Coba Lagi"
- **Upload foto gagal (> 2MB):** Pesan "Ukuran foto melebihi batas 2MB; gunakan gambar yang lebih kecil"
- **Import Excel format salah:** Pesan deskriptif tentang kolom yang tidak sesuai + contoh format yang benar
- **Penukaran reward gagal (saldo tidak cukup):** Pesan "Saldo poin tidak mencukupi (tersedia: X, dibutuhkan: Y)"
- **Reward kadaluarsa atau kuota habis:** Pesan "Reward ini sudah tidak tersedia"

### 12.4 Member Landing Page
- **Nomor telepon tidak ditemukan:** Pesan "Nomor ini belum terdaftar di NashtyPeople. Daftarkan dirimu saat transaksi berikutnya!"
- **Koneksi lambat:** Loading spinner; timeout dengan pesan "Koneksi lambat, coba lagi"

---

## 13. Assumptions

> ⚠️ Asumsi-asumsi berikut dibuat berdasarkan inferensi dari dokumen yang ada. Harus dikonfirmasi sebelum development dimulai jika belum pernah dibahas secara eksplisit.

1. **[DIASUMSIKAN]** Margin untuk Menu Engineering diambil dari data HPP yang di-fetch dari Nashty Cost System (`nashtycost.pages.dev`). Jika data HPP tidak tersedia untuk suatu item, margin dihitung dari harga jual saja dan ditandai dengan indikator "HPP tidak tersedia".

2. **[PERLU KONFIRMASI]** Halaman publik `/member` tidak memerlukan autentikasi apapun — cukup input nomor telepon sebagai identifier.

3. **[DIASUMSIKAN]** Format nomor order adalah `SNY-XXXX` (sequence per outlet per hari, di-generate server-side oleh Express.js) — unik dalam satu hari operasional.

4. **[DIASUMSIKAN]** Konfigurasi default KDS (dark mode, audio on) berlaku untuk semua device baru; perubahan per device tersimpan di localStorage device tersebut.

---

## 14. Open Questions

Semua pertanyaan klarifikasi telah dijawab. Tidak ada open question yang tersisa sebelum development.

---

*Dokumen ini merupakan single source of truth untuk fase Architecture dan Database Design NASHTY OS.*
*Versi 1.0 — Juni 2026 — CafeMargin (PT Xolvon Kehidupan Cerdas Abadi)*
