# Dokumen Kebutuhan — NASHTY OS

## Pendahuluan

NASHTY OS adalah sistem manajemen F&B (Food & Beverage) berbasis web yang terdiri dari empat modul terintegrasi: **KDS (Kitchen Display System)**, **POS (Point of Sale Terminal)**, **Backoffice (Dashboard & Manajemen)**, dan **CRM (integrasi NashtyPeople)**. Sistem ini dirancang untuk operasi restoran modern yang membutuhkan alur kerja realtime antara kasir, dapur, dan manajemen, dengan dukungan multi-outlet, multi-perangkat, cetak struk via Bluetooth, umpan balik audio, dan mode offline.

Tujuan utama NASHTY OS adalah mempercepat pelayanan, mengurangi kesalahan order, meningkatkan visibilitas operasional, dan membangun loyalitas pelanggan melalui otomasi.

---

## Glosarium

- **KDS**: Kitchen Display System — layar di dapur yang menampilkan order aktif secara realtime.
- **POS**: Point of Sale Terminal — antarmuka kasir untuk input order, pembayaran, dan manajemen shift.
- **Backoffice**: Modul dashboard dan manajemen untuk owner/manager — analitik, menu, konfigurasi POS/KDS, tim, dan outlet.
- **CRM**: Integrasi dengan NashtyPeople CRM — sistem loyalitas pelanggan yang sudah live dan berjalan secara independen. Scope NASHTY OS hanya pada sinkronisasi data transaksi dan data customer dari POS/Backoffice ke NashtyPeople.
- **NashtyPeople**: Platform CRM loyalitas pelanggan milik Nashty Hot Chicken yang sudah berjalan secara independen.
- **Order**: Satu transaksi pemesanan dengan satu atau lebih item menu.
- **Order Card**: Kartu visual di KDS yang merepresentasikan satu order aktif.
- **Timer**: Penghitung waktu berjalan sejak order masuk ke KDS.
- **Status Order**: Kondisi order — Baru, Dalam Proses, Siap, Disajikan, Void.
- **Modifier**: Opsi tambahan wajib pada item menu (contoh: level pedas, suhu minuman).
- **Add-on**: Opsi tambahan opsional/berbayar pada item menu (contoh: extra sambal, oat milk).
- **Shift**: Periode kerja kasir dari buka sampai tutup kasir.
- **Struk**: Bukti transaksi yang dicetak atau dikirim ke pelanggan.
- **Bluetooth Printer**: Printer termal nirkabel (Epson/Star/Sunmi) yang dikoneksikan via Web Bluetooth API.
- **Supabase**: Platform backend berbasis PostgreSQL yang digunakan sebagai database utama, autentikasi, storage, dan realtime sync.
- **PIN Manager**: Kode otentikasi khusus manajer untuk aksi sensitif (void, diskon besar).
- **Split Payment**: Pembayaran satu order dibagi ke beberapa metode.
- **Outlet**: Satu lokasi usaha yang menggunakan NASHTY OS.
- **Role**: Tingkat akses pengguna — Owner, Manager, Kasir.
- **SNY-XXXX**: Format nomor order unik (contoh: SNY-0048).
- **Web Bluetooth API**: API browser standar untuk koneksi perangkat Bluetooth dari web app.
- **Service Worker**: Teknologi browser untuk menjalankan logika offline pada web app.
- **IndexedDB**: Penyimpanan lokal browser untuk data offline POS.
- **Swipe-to-Complete**: Mekanisme gestur horizontal pada KDS untuk menandai order selesai.
- **Urgent Strip**: Banner merah sticky di bagian atas KDS yang menampilkan semua order dalam status urgent.
- **Compact Mode**: Mode tampilan KDS dengan kartu lebih kecil, aktif otomatis saat queue ≥ 12 order.
- **Left Strip**: Indikator warna berupa garis vertikal tipis di sisi kiri Order Card KDS untuk menunjukkan urgency.
- **Member Landing Page**: Halaman publik (`/member`) milik NashtyPeople untuk pelanggan melihat poin dan riwayat transaksi mereka.
- **Reward Points**: Poin yang dapat dikumpulkan dan ditukar oleh pelanggan melalui program loyalitas NashtyPeople.
- **Menu Engineering**: Analitik performa menu yang mengklasifikasikan item ke dalam kategori Stars, Plowhorses, Puzzles, dan Dogs.
- **Activity Logs**: Audit trail berisi catatan semua aksi yang dilakukan oleh pengguna di sistem.
- **Service Charge**: Biaya layanan dalam bentuk persentase yang ditambahkan ke subtotal order.
- **Delivery Platform**: Platform pesan antar pihak ketiga — GoFood, GrabFood, ShopeeFood.
- **Supabase Realtime**: Fitur Supabase untuk sinkronisasi data antar modul secara realtime menggunakan channel subscription.
- **RLS (Row Level Security)**: Mekanisme keamanan database Supabase untuk membatasi akses data per role pengguna.
- **Express.js**: Backend API server yang menangani logika server-side (nomor order auto-increment, validasi, dll).

---

## Kebutuhan

---

### Kebutuhan 1: Login Staff POS (PIN-based)

**User Story:** Sebagai staf kasir, saya ingin login ke POS dengan memilih kartu nama saya lalu memasukkan PIN 4 digit, sehingga akses ke sistem terlindungi dan setiap transaksi tercatat atas nama staf yang benar.

#### Kriteria Penerimaan

1. THE POS SHALL menampilkan halaman login dengan grid kartu staf yang berisi 2 hingga 6 kartu berdasarkan jumlah akun aktif di outlet.
2. THE POS SHALL menampilkan pada setiap kartu staf: nama staf, inisial avatar, dan role (Kasir atau Manager).
3. WHEN staf mengetuk kartu nama, THE POS SHALL menghighlight kartu tersebut dengan warna oranye dan menampilkan panel input PIN 4 digit.
4. THE POS SHALL menampilkan input PIN sebagai 4 titik (dots) yang terisi satu per satu sesuai digit yang dimasukkan.
5. WHEN 4 digit PIN telah dimasukkan, THE POS SHALL mengaktifkan tombol konfirmasi (✓) untuk melanjutkan login.
6. WHEN staf menekan tombol konfirmasi dengan 4 digit PIN, THE POS SHALL memvalidasi PIN terhadap data di Supabase dan memproses login jika PIN benar.
7. IF PIN yang dimasukkan salah, THEN THE POS SHALL menampilkan pesan error dan mengosongkan input PIN tanpa mengunci akun.
8. WHERE role staf adalah Manager, THE POS SHALL memberikan akses ke fitur Laporan dan Void selain fitur kasir biasa.
9. WHILE perangkat POS idle melebihi durasi yang dikonfigurasi di Backoffice, THE POS SHALL secara otomatis logout dan menampilkan kembali halaman login kartu staf.
10. THE Backoffice SHALL memungkinkan Owner atau Manager mengonfigurasi durasi idle sebelum auto-logout pada POS.

---

### Kebutuhan 2: Tampilan Order Realtime di KDS

**User Story:** Sebagai chef/koki, saya ingin melihat semua order aktif secara realtime di layar dapur, sehingga saya dapat memproses order dengan urutan yang benar dan tidak melewatkan pesanan.

#### Kriteria Penerimaan

1. WHEN sebuah order baru dibuat di POS, THE KDS SHALL menampilkan Order Card baru dalam waktu kurang dari 2 detik.
2. THE KDS SHALL menampilkan pada setiap Order Card: nomor order (format SNY-XXXX), nomor meja atau label tipe order, nama kasir, timer berjalan (format MM:SS), daftar item beserta kuantitas dan modifier, add-on per item, catatan pelanggan, dan badge tipe order.
3. THE KDS SHALL menampilkan badge tipe order pada setiap Order Card: Dine In, Take Away, GoFood, GrabFood, atau ShopeeFood.
4. THE KDS SHALL menampilkan modifier item sebagai chip badge berwarna oranye dan add-on item sebagai chip badge berwarna hijau.
5. THE KDS SHALL memperbarui tampilan Order Card secara realtime tanpa perlu refresh halaman menggunakan Supabase Realtime subscription.
6. WHEN koneksi Supabase Realtime terputus, THE KDS SHALL menampilkan indikator status koneksi yang jelas kepada pengguna.
7. THE KDS SHALL mendukung pembukaan di beberapa perangkat atau tab browser secara bersamaan dengan data yang sinkron.
8. THE KDS SHALL menampilkan queue summary di header: jumlah order aktif, jumlah total item, dan jumlah order dalam status urgent.

---

### Kebutuhan 3: Sistem Timer, Urgency, dan Peringatan Visual KDS

**User Story:** Sebagai chef, saya ingin melihat berapa lama setiap order sudah menunggu dengan indikasi warna yang jelas dan banner urgent yang mencolok, sehingga saya dapat memprioritaskan order yang sudah lama tanpa harus mencari satu per satu.

#### Kriteria Penerimaan

1. THE KDS SHALL menjalankan timer per Order Card yang menghitung waktu berlalu sejak order masuk, diperbarui setiap detik.
2. WHILE timer sebuah Order Card kurang dari batas waktu peringatan, THE KDS SHALL menampilkan timer badge berwarna hijau dan left strip berwarna hijau pada Order Card.
3. WHEN timer sebuah Order Card mencapai batas waktu peringatan (default 10 menit, dapat dikonfigurasi dari Backoffice), THE KDS SHALL mengubah timer badge menjadi kuning dan left strip menjadi kuning.
4. WHEN timer sebuah Order Card mencapai batas waktu kritis/urgent (default 20 menit, dapat dikonfigurasi dari Backoffice), THE KDS SHALL mengubah timer badge menjadi merah, left strip menjadi merah, dan mengaktifkan efek pulse pada border kartu.
5. THE KDS SHALL menampilkan sticky urgent strip di atas grid saat terdapat satu atau lebih order dengan status urgent, berisi daftar nomor order urgent yang dapat diklik untuk scroll ke kartu tersebut.
6. THE KDS SHALL secara otomatis menyembunyikan urgent strip ketika tidak ada order berstatus urgent.
7. THE KDS SHALL menampilkan counter "⚠ Urgent" pada filter bar dengan jumlah order urgent saat ini.
8. WHERE fitur alert suara diaktifkan, WHEN timer sebuah Order Card mencapai batas kritis, THE KDS SHALL memutar suara beep peringatan.
9. THE Backoffice SHALL memungkinkan Owner atau Manager mengonfigurasi batas waktu peringatan dan batas waktu kritis melalui halaman KDS — Production Time.
10. WHERE alert flash diaktifkan di Alert Settings, WHEN timer mencapai batas kritis, THE KDS SHALL mengaktifkan efek flash pada border Order Card.

---

### Kebutuhan 4: Swipe-to-Complete dan Auto-Sort KDS

**User Story:** Sebagai chef, saya ingin menyelesaikan order dengan gestur swipe horizontal dan melihat antrian yang sudah diurutkan otomatis berdasarkan urgency, sehingga alur kerja dapur lebih cepat dan intuitif.

#### Kriteria Penerimaan

1. THE KDS SHALL menyediakan swipe track horizontal di bagian bawah setiap Order Card sebagai mekanisme untuk menyelesaikan order.
2. WHEN chef melakukan swipe horizontal penuh pada swipe track, THE KDS SHALL mengubah status order menjadi "siap" di Supabase, menandai kartu sebagai selesai, dan memicu notifikasi ke POS.
3. THE KDS SHALL menampilkan teks "Swipe →" pada swipe track dan menganimasikan fill berwarna sesuai urgency saat chef mulai menyeret.
4. WHEN chef swipe complete pada sebuah Order Card, THE POS SHALL menampilkan fullscreen overlay berisi konfirmasi "Pesanan Selesai!" dengan nomor order, daftar item, dan tombol "✓ Pesanan Sudah Diserahkan ke Pelanggan".
5. WHEN kasir menekan tombol konfirmasi pada POS overlay, THE POS SHALL menutup overlay dan mengubah status order menjadi "disajikan".
6. THE KDS SHALL secara otomatis mengurutkan Order Card berdasarkan prioritas: Urgent → Warning → Fresh, kemudian berdasarkan waktu masuk (terlama di atas) dalam setiap kelompok prioritas.
7. WHEN jumlah order aktif di KDS mencapai batas kompak (default 12 order, dapat dikonfigurasi dari Backoffice), THE KDS SHALL secara otomatis mengaktifkan Compact Mode untuk memperkecil ukuran kartu.
8. WHEN jumlah order aktif turun di bawah batas kompak, THE KDS SHALL secara otomatis menonaktifkan Compact Mode.

---

### Kebutuhan 5: Filter Bar dan Day/Night Mode KDS

**User Story:** Sebagai chef saat kondisi pencahayaan berbeda, saya ingin memfilter order berdasarkan tipe dan mengubah mode tampilan, sehingga layar KDS mudah dibaca di berbagai kondisi.

#### Kriteria Penerimaan

1. THE KDS SHALL menyediakan filter bar dengan pilihan: Semua, Dine In, Take Away, Delivery, dan ⚠ Urgent.
2. WHEN chef memilih filter "Delivery", THE KDS SHALL menampilkan hanya order dengan tipe GoFood, GrabFood, atau ShopeeFood.
3. WHEN chef memilih filter "⚠ Urgent", THE KDS SHALL menampilkan hanya order dengan status urgent.
4. THE KDS SHALL menyediakan tombol toggle Day/Night mode di header KDS.
5. WHEN pengguna mengaktifkan Day mode, THE KDS SHALL mengganti skema warna menjadi terang (latar putih/krem) untuk keterbacaan di lingkungan terang.
6. WHEN pengguna mengaktifkan Night mode, THE KDS SHALL menggunakan skema warna gelap (latar hitam) sebagai tampilan default.
7. THE KDS SHALL menyimpan preferensi mode tampilan secara lokal per perangkat sehingga tetap aktif setelah halaman di-reload.
8. THE Backoffice SHALL memungkinkan Owner atau Manager mengonfigurasi default mode tampilan (Day/Night) per outlet, atau mengatur auto-switch berdasarkan jam.

---

### Kebutuhan 6: Interaksi Chef pada Item Order (Checklist)

**User Story:** Sebagai chef, saya ingin menandai item individual yang sudah selesai dimasak, sehingga progress setiap order dapat terpantau secara granular.

#### Kriteria Penerimaan

1. WHEN chef mengetuk sebuah item pada Order Card, THE KDS SHALL menandai item tersebut sebagai selesai dengan tampilan teks dicoret.
2. WHEN chef mengetuk item yang sudah ditandai selesai, THE KDS SHALL menghapus tanda selesai pada item tersebut.
3. THE KDS SHALL menampilkan progress bar di bagian bawah Order Card yang mencerminkan persentase item yang sudah ditandai selesai dari total item dalam order.
4. WHEN semua item pada Order Card telah ditandai selesai, THE KDS SHALL memberikan highlight visual sebagai petunjuk bahwa order siap di-swipe complete.
5. IF chef melakukan swipe complete sebelum semua item ditandai selesai, THEN THE KDS SHALL tetap mengeksekusi aksi tanpa memblokir chef.

---

### Kebutuhan 7: Input Order dan Panel Menu POS

**User Story:** Sebagai kasir, saya ingin dapat mencari dan menambahkan item menu dengan cepat menggunakan antarmuka sentuh, sehingga proses pemesanan berlangsung efisien.

#### Kriteria Penerimaan

1. THE POS SHALL menampilkan layout landscape dengan proporsi 62% panel menu dan 38% panel cart.
2. THE POS SHALL menampilkan item menu dalam grid dengan emoji/foto, nama item, dan harga pada setiap tile.
3. THE POS SHALL menampilkan tab kategori di atas grid menu untuk memfilter item berdasarkan kategori.
4. WHEN kasir mengetuk sebuah item menu, THE POS SHALL menambahkan item tersebut ke cart.
5. THE POS SHALL menyediakan kolom pencarian yang memfilter item menu berdasarkan nama secara realtime saat kasir mengetik.
6. WHEN item yang ditambahkan memiliki modifier yang wajib dipilih, THE POS SHALL menampilkan dialog pemilihan modifier sebelum item ditambahkan ke cart.
7. WHERE modifier bersifat opsional atau add-on, THE POS SHALL memungkinkan kasir melewati pemilihan.
8. THE POS SHALL mendukung orientasi landscape-first dan dioptimalkan untuk interaksi sentuh pada tablet.

---

### Kebutuhan 8: Manajemen Cart, Tipe Order, dan Service Charge POS

**User Story:** Sebagai kasir, saya ingin mengelola isi cart dengan mudah termasuk mengubah kuantitas, memilih tipe order termasuk platform delivery, dan melihat service charge, sehingga order yang dikirim ke dapur akurat.

#### Kriteria Penerimaan

1. THE POS SHALL menampilkan semua item dalam cart beserta kuantitas, harga per item, modifier, add-on, dan subtotal.
2. WHEN kasir menekan tombol tambah atau kurang pada item di cart, THE POS SHALL memperbarui kuantitas item dan subtotal cart.
3. WHEN kuantitas sebuah item di cart dikurangi hingga nol, THE POS SHALL menghapus item tersebut dari cart.
4. THE POS SHALL menyediakan pilihan tipe order: Dine In (dengan input nomor meja), Take Away, GoFood, GrabFood, dan ShopeeFood.
5. THE POS SHALL menampilkan ringkasan total harga di cart yang mencakup: subtotal, pajak PPN (11%), service charge (5%), diskon, dan total akhir.
6. WHEN kasir menekan tombol kirim order, THE POS SHALL menyimpan order ke Supabase dan Order Card baru muncul di KDS melalui Supabase Realtime.
7. THE POS SHALL menyediakan field untuk mencatat informasi pelanggan (nama, nomor HP) pada order.

---

### Kebutuhan 9: Alur Pembayaran POS

**User Story:** Sebagai kasir, saya ingin memproses berbagai metode pembayaran termasuk pembayaran terbagi, sehingga semua jenis transaksi pelanggan dapat dilayani.

#### Kriteria Penerimaan

1. THE POS SHALL mendukung 8 metode pembayaran: Tunai, Transfer, QRIS, BCA, Debit, GoFood, GrabFood, dan ShopeeFood.
2. WHEN kasir memilih metode pembayaran Tunai, THE POS SHALL menampilkan numpad untuk input jumlah uang yang diterima, shortcut nominal (+50K, +100K, +200K, Pas), dan menghitung kembalian secara otomatis.
3. WHEN kasir memilih metode pembayaran Delivery (GoFood/GrabFood/ShopeeFood), THE POS SHALL mengunci numpad dan menampilkan field input nomor order platform.
4. WHEN kasir memilih metode pembayaran QRIS atau Transfer, THE POS SHALL menampilkan hanya tombol konfirmasi manual tanpa numpad.
5. THE POS SHALL mendukung split payment sehingga satu order dapat dibayar dengan kombinasi beberapa metode pembayaran.
6. WHEN pembayaran berhasil diproses, THE POS SHALL menyimpan data transaksi ke Supabase dan memicu alur pencetakan struk.
7. WHEN kasir menerapkan diskon pada order, THE POS SHALL mendukung diskon dalam bentuk persentase (%) maupun nominal rupiah (Rp).
8. WHEN kasir menerapkan diskon atau melakukan void item dengan nilai di atas batas yang dikonfigurasi, THE POS SHALL meminta PIN Manager sebelum aksi dieksekusi.
9. IF pembayaran gagal diproses, THEN THE POS SHALL menampilkan pesan error yang deskriptif dan mempertahankan state cart tanpa kehilangan data.
10. THE Backoffice SHALL memungkinkan Owner atau Manager mengonfigurasi metode pembayaran mana saja yang aktif melalui halaman POS — Metode Pembayaran.

---

### Kebutuhan 10: Lookup dan Integrasi Pelanggan di POS

**User Story:** Sebagai kasir, saya ingin mencari pelanggan terdaftar di NashtyPeople dan mengaitkan transaksi ke profil mereka, sehingga riwayat transaksi terlacak dan poin loyalitas terupdate otomatis.

#### Kriteria Penerimaan

1. THE POS SHALL menyediakan fitur pencarian pelanggan berdasarkan nama atau nomor HP yang tersinkronisasi dengan data NashtyPeople.
2. WHEN kasir mengetikkan kata kunci pencarian, THE POS SHALL menampilkan daftar pelanggan yang cocok dalam waktu kurang dari 1 detik.
3. WHEN kasir memilih pelanggan dari hasil pencarian, THE POS SHALL mengisi data pelanggan pada order secara otomatis dan menampilkan ringkasan poin serta tier segmentasi pelanggan.
4. WHEN transaksi berhasil diselesaikan untuk pelanggan terdaftar, THE System SHALL mengirimkan data transaksi ke NashtyPeople CRM untuk pembaruan poin dan riwayat kunjungan secara otomatis.
5. THE POS SHALL memungkinkan kasir membuat data pelanggan baru dengan mengisi nama dan nomor HP, yang akan tersinkronisasi ke NashtyPeople.

---

### Kebutuhan 11: Manajemen Shift Kasir

**User Story:** Sebagai kasir, saya ingin membuka dan menutup shift dengan rekap kas, sehingga pengelolaan kas harian dapat dipertanggungjawabkan.

#### Kriteria Penerimaan

1. WHEN kasir membuka shift, THE POS SHALL mencatat waktu mulai shift, identitas kasir, dan jumlah kas awal yang dimasukkan.
2. WHEN kasir menutup shift, THE POS SHALL menampilkan ringkasan shift: total transaksi, total per metode pembayaran, jumlah order, dan selisih kas.
3. THE POS SHALL memungkinkan kasir melakukan cash count (hitung fisik kas) sebelum menutup shift.
4. THE POS SHALL menyimpan data setiap shift ke Supabase sehingga dapat diakses dari Backoffice.
5. WHILE shift belum dibuka, THE POS SHALL memblokir akses ke fitur transaksi dan meminta kasir membuka shift terlebih dahulu.

---

### Kebutuhan 12: Cetak Struk via Bluetooth

**User Story:** Sebagai kasir, saya ingin mencetak struk ke printer Bluetooth setelah transaksi selesai, sehingga pelanggan mendapat bukti transaksi fisik.

#### Kriteria Penerimaan

1. THE POS SHALL mendukung koneksi ke printer termal Bluetooth (Epson, Star, Sunmi) menggunakan Web Bluetooth API dari browser.
2. WHEN kasir menekan tombol cetak struk, THE POS SHALL mengirimkan data struk ke printer Bluetooth yang terhubung dan mencetak struk termal.
3. THE POS SHALL menampilkan pada struk: nama outlet, nomor order, tanggal dan waktu, daftar item beserta harga, subtotal, pajak (11%), service charge (5%), diskon, total, metode pembayaran, dan nama kasir.
4. IF koneksi printer Bluetooth terputus saat proses cetak, THEN THE POS SHALL menampilkan pesan error dan menawarkan opsi untuk mencoba ulang atau melewati pencetakan.
5. THE POS SHALL memungkinkan cetak ulang struk dari halaman Riwayat Transaksi.
6. THE Backoffice SHALL memungkinkan Owner atau Manager mengonfigurasi template dan layout struk melalui halaman POS — Pengaturan Struk.

---

### Kebutuhan 13: Mode Offline POS

**User Story:** Sebagai kasir, saya ingin transaksi tetap dapat diproses meskipun koneksi internet terputus, sehingga operasional restoran tidak terganggu saat gangguan jaringan.

#### Kriteria Penerimaan

1. WHILE perangkat POS tidak memiliki koneksi internet, THE POS SHALL tetap memungkinkan kasir membuat dan memproses order menggunakan data menu yang tersimpan di IndexedDB lokal.
2. THE POS SHALL menyimpan semua transaksi yang dibuat saat offline ke antrian sinkronisasi lokal (IndexedDB).
3. WHEN koneksi internet pulih, THE POS SHALL secara otomatis mensinkronisasi semua transaksi dari antrian lokal ke Supabase tanpa intervensi pengguna.
4. THE POS SHALL menampilkan indikator status koneksi yang jelas (online/offline) kepada kasir setiap saat.
5. IF terjadi konflik data saat sinkronisasi, THEN THE POS SHALL mencatat konflik tersebut dan menampilkan notifikasi kepada Manager untuk ditinjau.
6. THE POS SHALL menggunakan Service Worker untuk menjaga aset aplikasi tetap tersedia saat offline.

---

### Kebutuhan 14: Notifikasi Audio dan Visual Antar Modul

**User Story:** Sebagai kasir dan chef, saya ingin mendapatkan notifikasi suara dan visual saat ada perubahan status order penting, sehingga saya tidak melewatkan informasi kritis meskipun sedang fokus pada tugas lain.

#### Kriteria Penerimaan

1. WHEN Order Card baru masuk ke KDS, THE KDS SHALL menampilkan badge "NEW" dengan glow oranye selama 3,5 detik dan memutar suara notifikasi kedatangan order (single ding).
2. WHEN chef melakukan swipe complete pada Order Card, THE POS SHALL memutar suara notifikasi dan menampilkan fullscreen overlay konfirmasi penyerahan order kepada pelanggan.
3. WHEN timer Order Card mencapai batas kritis, THE KDS SHALL memutar suara beep peringatan (double ding) dan mengaktifkan efek pulse pada border kartu.
4. WHEN transaksi pembayaran berhasil diselesaikan, THE POS SHALL memutar suara konfirmasi transaksi.
5. THE KDS SHALL menyediakan tombol toggle untuk mengaktifkan atau menonaktifkan alert suara per perangkat.
6. THE POS SHALL menyediakan tombol toggle untuk mengaktifkan atau menonaktifkan notifikasi suara per perangkat.
7. WHERE alert flash diaktifkan di KDS Alert Settings, WHEN timer mencapai batas kritis, THE KDS SHALL mengaktifkan efek flash pada Order Card selain efek pulse standar.
8. THE Backoffice SHALL memungkinkan Owner atau Manager mengonfigurasi toggle suara dan escalation alert (repeat tiap 1 menit) melalui halaman KDS — Alert Settings.

---

### Kebutuhan 15: Dashboard Analitik Backoffice

**User Story:** Sebagai owner atau manager, saya ingin melihat ringkasan performa bisnis secara visual di dashboard, sehingga saya dapat membuat keputusan operasional dengan cepat.

#### Kriteria Penerimaan

1. THE Backoffice SHALL menampilkan dashboard dengan metrik utama: pendapatan hari ini, pendapatan bulan ini, jumlah transaksi (termasuk void & refund), dan Average Order Value — masing-masing dengan persentase perubahan vs periode sebelumnya.
2. THE Backoffice SHALL menampilkan grafik pendapatan 7 hari terakhir.
3. THE Backoffice SHALL menampilkan daftar Top 5 produk terlaris hari ini berdasarkan jumlah terjual dan total revenue.
4. THE Backoffice SHALL menampilkan breakdown metode pembayaran dalam bentuk pie/bar chart.
5. THE Backoffice SHALL menyediakan Quick Actions: shortcut Tambah Produk, Tambah Kategori, Tambah Kasir, dan Buat Promosi.
6. WHEN Owner atau Manager memilih rentang tanggal, THE Backoffice SHALL menampilkan data analitik untuk rentang tersebut dalam waktu kurang dari 5 detik dengan query ke Supabase.

---

### Kebutuhan 16: Manajemen Menu Backoffice (Kategori, Produk, Modifier)

**User Story:** Sebagai manager atau owner, saya ingin mengelola menu restoran secara lengkap dari Backoffice, sehingga perubahan menu langsung tersinkron ke POS tanpa konfigurasi tambahan.

#### Kriteria Penerimaan

1. THE Backoffice SHALL memungkinkan pengguna membuat, membaca, memperbarui, dan menghapus Kategori menu (CRUD), termasuk nama dan urutan tampilan.
2. THE Backoffice SHALL memungkinkan pengguna membuat, membaca, memperbarui, dan menghapus Produk (item menu) dengan atribut: nama, kategori, harga, status aktif/nonaktif, foto (JPG/PNG maks 2MB), outlet availability, dan assignment ke modifier group. Termasuk fitur duplikat dan arsip produk.
3. THE Backoffice SHALL memungkinkan pengguna membuat, membaca, memperbarui, dan menghapus Modifier Groups beserta opsi-opsi di dalamnya, termasuk: nama group, tipe (pilih 1 / multi), daftar opsi dengan harga tambahan, urutan tampilan. Satu modifier group dapat di-assign ke banyak produk.
4. WHEN sebuah item menu dinonaktifkan, THE POS SHALL tidak menampilkan item tersebut dalam grid menu kasir.
5. WHEN perubahan menu disimpan di Backoffice, THE POS SHALL mencerminkan perubahan tersebut dalam waktu kurang dari 10 detik melalui Supabase Realtime.
6. THE Backoffice SHALL memungkinkan upload foto item menu ke Supabase Storage dengan ukuran file maksimum 2 MB.

---

### Kebutuhan 17: Laporan Penjualan dan Ekspor Data

**User Story:** Sebagai owner, saya ingin menghasilkan laporan penjualan yang detail dan dapat diekspor, sehingga saya dapat menganalisis performa bisnis di luar sistem.

#### Kriteria Penerimaan

1. THE Backoffice SHALL menampilkan laporan Ringkasan: Gross Sales, Diskon, Refund, Net Sales, Pajak (11%), Service Charge (5%), Total Collected — dengan filter periode.
2. THE Backoffice SHALL menampilkan laporan Item Sales: penjualan per produk dengan qty terjual dan total revenue.
3. THE Backoffice SHALL menampilkan laporan Category Sales: penjualan per kategori menu.
4. THE Backoffice SHALL menampilkan laporan Modifier Sales: data penjualan per modifier/add-on.
5. THE Backoffice SHALL menampilkan laporan Pajak & Biaya: breakdown pajak dan service charge per periode.
6. THE Backoffice SHALL memungkinkan pengguna mengekspor laporan ke format PDF dan cetak struk ringkasan shift.
7. THE Backoffice SHALL menampilkan laporan ringkasan shift yang mencakup semua shift dalam periode yang dipilih.

---

### Kebutuhan 18: Menu Engineering (Analitik Performa Menu)

**User Story:** Sebagai owner, saya ingin mengetahui performa setiap item menu berdasarkan popularitas dan kontribusi margin, sehingga saya dapat membuat keputusan menu yang lebih menguntungkan.

#### Kriteria Penerimaan

1. THE Backoffice SHALL menyediakan fitur Menu Engineering yang menganalisis performa item menu berdasarkan data penjualan dan data HPP dari Nashty Cost System.
2. THE Backoffice SHALL mengklasifikasikan setiap item menu ke dalam satu dari empat kategori: Stars (populer + margin tinggi), Plowhorses (populer + margin rendah), Puzzles (tidak populer + margin tinggi), dan Dogs (tidak populer + margin rendah).
3. THE Backoffice SHALL mengambil data HPP dari Nashty Cost System (nashtycost.pages.dev) untuk digunakan dalam perhitungan COGS, margin per produk, dan profitability analysis.
4. THE Backoffice SHALL menampilkan visualisasi menu engineering dalam bentuk matriks yang memudahkan Owner membaca distribusi item — tersedia per item, per kategori, dan per add-on.
5. THE Backoffice SHALL memungkinkan Owner memfilter analitik Menu Engineering berdasarkan periode waktu dan kategori menu.

---

### Kebutuhan 19: Multi-Outlet Support

**User Story:** Sebagai owner yang memiliki lebih dari satu cabang restoran, saya ingin mengelola semua outlet dari satu akun Backoffice dengan konfigurasi yang dapat berbeda per outlet, sehingga operasional multi-cabang dapat dipantau dan dikonfigurasi secara terpusat.

#### Kriteria Penerimaan

1. THE Backoffice SHALL menyediakan outlet switcher di sidebar yang memungkinkan Owner berpindah antar outlet.
2. THE Backoffice SHALL memungkinkan Owner membuat, membaca, memperbarui, dan menonaktifkan data outlet yang mencakup: nama outlet, alamat, nomor telepon, dan jam operasi.
3. THE Backoffice SHALL menyimpan konfigurasi KDS (timer thresholds, alert settings, default display mode) secara terpisah per outlet di Supabase.
4. THE Backoffice SHALL menyimpan konfigurasi POS (metode pembayaran aktif, template struk, auto-logout duration, pajak, service charge) secara terpisah per outlet di Supabase.
5. WHEN Owner berpindah ke outlet lain melalui outlet switcher, THE Backoffice SHALL menampilkan data, laporan, dan konfigurasi yang sesuai dengan outlet yang dipilih.
6. THE Owner SHALL memiliki akses ke semua outlet dalam satu akun, sedangkan THE Manager SHALL hanya memiliki akses ke outlet yang ditugaskan kepadanya.

---

### Kebutuhan 20: Manajemen Tim (Owner, Manager, Kasir)

**User Story:** Sebagai owner, saya ingin mengelola semua anggota tim dengan pembagian peran yang jelas, sehingga setiap orang hanya memiliki akses sesuai tanggung jawabnya.

#### Kriteria Penerimaan

1. THE Backoffice SHALL menyediakan halaman Owners, Managers, dan Kasir sebagai tiga sub-modul terpisah dalam modul Tim.
2. THE Backoffice SHALL memungkinkan Owner menambah, memperbarui, dan menonaktifkan akun Owner lain (co-owner).
3. THE Backoffice SHALL memungkinkan Owner menambah, memperbarui, dan menonaktifkan akun Manager serta menugaskan Manager ke outlet tertentu.
4. THE Backoffice SHALL memungkinkan Owner atau Manager menambah, memperbarui, dan menonaktifkan akun Kasir beserta PIN (4-digit) mereka, yang disimpan sebagai bcrypt hash di Supabase.
5. THE Backoffice SHALL menampilkan pada setiap kartu Kasir: nama, outlet yang ditugaskan, status aktif/nonaktif.
6. WHEN akun pengguna dinonaktifkan, THE System SHALL mencabut sesi aktif pengguna tersebut dalam waktu kurang dari 1 menit.

---

### Kebutuhan 21: Konfigurasi KDS di Backoffice

**User Story:** Sebagai owner atau manager, saya ingin mengonfigurasi semua parameter KDS dari Backoffice, sehingga perilaku dapur dapat disesuaikan tanpa perlu mengubah kode.

#### Kriteria Penerimaan

1. THE Backoffice SHALL menyediakan halaman KDS — Production Time Rules untuk mengonfigurasi target waktu pengerjaan per kategori menu (misal: Makanan 12 mnt, Minuman 3 mnt) dan threshold On Time / Warning / Overdue per kategori.
2. THE Backoffice SHALL menyediakan halaman KDS — Alert Settings untuk mengonfigurasi: toggle suara order baru (single ding), toggle urgent sound (double ding), toggle flash alert saat overdue, escalation alert repeat tiap 1 menit, dan batas jumlah order untuk aktivasi Compact Mode (default 12).
3. THE Backoffice SHALL menyediakan halaman KDS — Analytics yang menampilkan data performa dapur: rata-rata waktu pengerjaan per kategori dan jumlah order overdue.
4. THE Backoffice SHALL memungkinkan Owner atau Manager mengonfigurasi default display mode (Dark/Day) per outlet, atau auto berdasarkan jam.
5. WHEN perubahan konfigurasi KDS disimpan di Backoffice, THE KDS SHALL menerapkan perubahan tersebut pada semua perangkat KDS yang terhubung dalam waktu kurang dari 30 detik melalui Supabase Realtime.

---

### Kebutuhan 22: Konfigurasi POS di Backoffice

**User Story:** Sebagai owner atau manager, saya ingin mengonfigurasi parameter POS termasuk metode pembayaran dan struk dari Backoffice, sehingga pengaturan operasional dapat disesuaikan tanpa gangguan ke kasir.

#### Kriteria Penerimaan

1. THE Backoffice SHALL menyediakan halaman POS — Pengaturan Umum untuk mengonfigurasi: nama outlet, jam operasional, pajak (%), service charge (%), dan durasi auto-logout.
2. THE Backoffice SHALL menyediakan halaman POS — Metode Pembayaran yang menampilkan semua 8 metode tersedia dengan toggle untuk mengaktifkan atau menonaktifkan masing-masing metode.
3. THE Backoffice SHALL menyediakan halaman POS — Pengaturan Struk untuk mengonfigurasi: konten struk (nama outlet, catatan footer, dsb.).
4. WHEN perubahan konfigurasi POS disimpan di Backoffice, THE POS SHALL menerapkan perubahan tersebut pada semua perangkat POS yang terhubung dalam waktu kurang dari 30 detik melalui Supabase Realtime.

---

### Kebutuhan 23: Activity Logs (Audit Trail)

**User Story:** Sebagai owner, saya ingin melihat semua aksi yang dilakukan oleh setiap pengguna di sistem, sehingga saya dapat melacak perubahan, mengidentifikasi kesalahan, dan memastikan akuntabilitas.

#### Kriteria Penerimaan

1. THE System SHALL mencatat setiap aksi signifikan ke tabel `activity_logs` di Supabase, termasuk: login/logout, pembuatan/pengeditan/penghapusan menu, void order, perubahan konfigurasi, dan penambahan/penonaktifan pengguna — dengan timestamp dan user.
2. THE Backoffice SHALL menyediakan halaman Activity Logs yang menampilkan log dalam urutan terbalik (terbaru di atas), berisi: timestamp, nama pengguna, role, aksi yang dilakukan, dan detail perubahan.
3. THE Backoffice SHALL memungkinkan Owner memfilter Activity Logs berdasarkan: rentang tanggal, role pengguna, dan jenis aksi.
4. WHEN sebuah void dilakukan di POS, THE System SHALL mencatat detail void ke Activity Logs termasuk nomor order, item yang di-void, nilai void, dan nama Manager yang memberikan otorisasi.
5. THE Owner SHALL dapat mengakses Activity Logs untuk semua outlet, sedangkan THE Manager SHALL hanya dapat melihat Activity Logs untuk outlet yang ditugaskan kepadanya.

---

### Kebutuhan 24: Integrasi CRM — Sinkronisasi dengan NashtyPeople

**User Story:** Sebagai owner, saya ingin setiap transaksi POS otomatis tersinkronisasi ke NashtyPeople CRM, sehingga data poin, riwayat kunjungan, dan segmentasi pelanggan selalu akurat tanpa input manual.

#### Kriteria Penerimaan

1. WHEN sebuah transaksi berhasil diselesaikan di POS untuk pelanggan terdaftar, THE System SHALL mengirimkan data transaksi (nomor struk, nominal, timestamp, outlet) ke NashtyPeople CRM secara otomatis.
2. THE System SHALL menangani kegagalan sinkronisasi dengan mekanisme retry otomatis, dan mencatat kegagalan ke log jika retry habis.
3. THE Backoffice SHALL menampilkan status integrasi NashtyPeople (terhubung/tidak) beserta log sinkronisasi terakhir.
4. THE POS SHALL dapat membaca data pelanggan (poin aktif, tier, nama) dari NashtyPeople untuk ditampilkan saat kasir melakukan lookup pelanggan.
5. THE Backoffice SHALL memungkinkan Owner mengonfigurasi koneksi integrasi NashtyPeople (API endpoint, API key) melalui halaman Pengaturan Integrasi.

---

### Kebutuhan 25: Riwayat Transaksi dan Void

**User Story:** Sebagai kasir atau manager, saya ingin melihat semua transaksi hari ini dan melakukan void jika ada kesalahan, sehingga rekam transaksi selalu akurat.

#### Kriteria Penerimaan

1. THE POS SHALL menampilkan halaman Riwayat Transaksi berisi daftar seluruh transaksi hari ini beserta nomor order, item, total, metode bayar, dan status.
2. THE POS SHALL memungkinkan void per transaksi dengan memerlukan alasan void dan konfirmasi PIN Manager.
3. WHEN void berhasil dilakukan, THE System SHALL mencatat refund ke laporan Petty Cash dan mengupdate status transaksi di Supabase.
4. THE POS SHALL memungkinkan cetak ulang struk dari halaman Riwayat Transaksi.
5. THE Backoffice SHALL menampilkan laporan void dengan detail: nomor order, item yang di-void, nilai void, nama Manager yang mengotorisasi, dan timestamp.

---

### Kebutuhan 26: Autentikasi dan Manajemen Peran Pengguna

**User Story:** Sebagai owner, saya ingin mengatur hak akses setiap pengguna berdasarkan perannya, sehingga data sensitif dan fungsi kritis hanya dapat diakses oleh pengguna yang berwenang.

#### Kriteria Penerimaan

1. THE System SHALL menggunakan Supabase Auth untuk autentikasi pengguna Backoffice dan CRM (email + password), sedangkan autentikasi POS dan KDS menggunakan PIN-based yang divalidasi terhadap tabel staff di Supabase.
2. THE System SHALL menerapkan tiga peran pengguna: Owner, Manager, dan Kasir — masing-masing dengan hak akses yang berbeda, dikontrol melalui Supabase Row Level Security (RLS).
3. THE Owner SHALL memiliki akses penuh ke semua modul, semua outlet, dan semua pengaturan sistem termasuk Activity Logs dan Menu Engineering.
4. THE Manager SHALL memiliki akses ke semua modul kecuali manajemen akun Owner.
5. THE Kasir SHALL memiliki akses hanya ke modul POS dan laporan shift miliknya sendiri.
6. WHEN pengguna mencoba mengakses halaman atau fungsi di luar hak akses perannya, THE System SHALL menampilkan halaman akses ditolak dan mengarahkan ke halaman yang sesuai.
7. THE Backoffice dan CRM SHALL menggunakan React Router untuk proteksi route berdasarkan role yang tersimpan di session Supabase Auth.

---

### Kebutuhan 27: Dukungan Multi-Perangkat dan Responsivitas

**User Story:** Sebagai pengelola restoran, saya ingin sistem dapat diakses dari berbagai jenis perangkat tanpa penurunan fungsi, sehingga investasi hardware dapat fleksibel sesuai kebutuhan.

#### Kriteria Penerimaan

1. THE KDS SHALL dioptimalkan untuk tampilan pada TV atau monitor besar (landscape) dengan font dan elemen yang dapat dibaca dari jarak 1–3 meter.
2. THE POS SHALL dioptimalkan untuk tablet landscape dengan elemen sentuh berukuran minimal 44×44 piksel.
3. THE Backoffice SHALL responsif dan dapat digunakan pada desktop browser dan tablet portrait.
4. THE System SHALL berfungsi pada browser modern: Chrome (versi 90+), Firefox (versi 88+), Safari (versi 14+), dan Edge (versi 90+).
5. THE System SHALL memuat tampilan awal setiap modul dalam waktu kurang dari 3 detik pada koneksi broadband standar (10 Mbps).

---

### Kebutuhan 28: Integritas Data Order (Validasi dan Sinkronisasi)

**User Story:** Sebagai sistem, saya ingin semua data order dapat disimpan ke Supabase dan dibaca kembali dengan integritas penuh, sehingga tidak ada data order yang rusak atau hilang selama transmisi.

#### Kriteria Penerimaan

1. WHEN sebuah order dibuat di POS, THE System SHALL menyimpan record order ke tabel `orders` di Supabase dengan semua field yang terdefinisi: nomor order (format SNY-XXXX, di-generate oleh Express backend), item, modifier, add-on, harga, tipe order, status, timestamp, kasir, pelanggan, service charge, dan pajak.
2. WHEN KDS atau Backoffice membaca data order dari Supabase, THE System SHALL menampilkan data yang konsisten dan valid.
3. IF validasi data order gagal sebelum disimpan, THEN THE System SHALL mengembalikan error deskriptif dan tidak menyimpan data yang tidak valid.
4. WHEN data order disinkronkan dari antrian offline ke Supabase, THE System SHALL memvalidasi setiap record order sebelum disimpan.
5. THE Express backend SHALL bertanggung jawab menghasilkan nomor order unik (SNY-XXXX) secara atomic untuk mencegah duplikasi nomor order.

---

*Dokumen ini direvisi berdasarkan SOW v2, SLA v2, dan mockup terbaru (NASHTY_OS_Wireframe.html, NASHTY_KDS_Mockup_1.html, NASHTY_Backoffice_Mockup_8.html). Stack teknologi: React (Vite) + Express.js + Supabase PostgreSQL.*
