// js/main.js
// Requires: js/data.js (global dataPengguna)

(function () {
  // Helper: query selector
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // Modal open/close handlers with error handling
  function openModal(id) {
    try {
      const m = document.getElementById(id);
      if (!m) {
        alert("Error: Modal dengan ID '" + id + "' tidak ditemukan.");
        return;
      }
      m.style.display = "block";
    } catch (e) {
      alert("Error saat membuka modal: " + e.message);
    }
  }

  function closeModal(id) {
    try {
      const m = document.getElementById(id);
      if (m) m.style.display = "none";
    } catch (e) {
      alert("Error saat menutup modal: " + e.message);
    }
  }

  // Initialize modal buttons with error handling
  try {
    const forgotBtn = document.getElementById("forgotBtn");
    const registerBtn = document.getElementById("registerBtn");
    
    if (forgotBtn) {
      forgotBtn.addEventListener("click", () => openModal("modalForgot"));
    }
    
    if (registerBtn) {
      registerBtn.addEventListener("click", () => openModal("modalRegister"));
    }

    // Close buttons
    $$(".close").forEach((el) =>
      el.addEventListener("click", (e) => {
        try {
          closeModal(e.target.dataset.close);
        } catch (err) {
          alert("Error saat menutup modal: " + err.message);
        }
      })
    );

    // Click outside modal to close
    window.addEventListener("click", function (e) {
      try {
        if (e.target.classList && e.target.classList.contains("modal")) {
          e.target.style.display = "none";
        }
      } catch (err) {
        alert("Error pada event click: " + err.message);
      }
    });
  } catch (e) {
    alert("Error saat inisialisasi modal: " + e.message);
  }

  // Login form handler
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) {
    alert("Error: Form login tidak ditemukan!");
  } else {
    loginForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      
      try {
        const emailInput = $("#email");
        const passwordInput = $("#password");
        
        if (!emailInput || !passwordInput) {
          alert("Error: Input email atau password tidak ditemukan.");
          return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email) {
          alert("Email tidak boleh kosong!");
          return;
        }

        if (!password) {
          alert("Password tidak boleh kosong!");
          return;
        }

        // Check if dataPengguna exists
        if (!window.dataPengguna || !Array.isArray(window.dataPengguna)) {
          alert("Error: Data pengguna tidak ditemukan. Pastikan file data.js sudah dimuat dengan benar.");
          return;
        }

        const users = window.dataPengguna;
        const found = users.find(
          (u) => u.email === email && u.password === password
        );

        if (!found) {
          alert("Email atau password yang anda masukkan salah!");
          return;
        }

        // Store minimal info to localStorage
        try {
          const safeUser = {
            id: found.id,
            nama: found.nama,
            email: found.email,
            role: found.role,
            lokasi: found.lokasi,
          };
          localStorage.setItem("sittaUser", JSON.stringify(safeUser));
          // Redirect to dashboard
          location.href = "dashboard.html";
        } catch (storageError) {
          alert("Error saat menyimpan data login: " + storageError.message);
        }
      } catch (e) {
        alert("Error saat proses login: " + e.message);
      }
    });
  }

  // Forgot password handler
  const forgotForm = document.getElementById("forgotForm");
  if (forgotForm) {
    forgotForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      
      try {
        const fpEmailInput = $("#fpEmail");
        if (!fpEmailInput) {
          alert("Error: Input email tidak ditemukan.");
          return;
        }

        const email = fpEmailInput.value.trim();
        
        if (!email) {
          alert("Email tidak boleh kosong!");
          return;
        }

        if (!window.dataPengguna || !Array.isArray(window.dataPengguna)) {
          alert("Error: Data pengguna tidak ditemukan.");
          return;
        }

        const found = window.dataPengguna.find((u) => u.email === email);
        
        if (!found) {
          alert("Email tidak ditemukan pada data pengguna (simulasi).");
        } else {
          alert("Instruksi reset password dikirim (simulasi) ke " + email);
          closeModal("modalForgot");
        }
      } catch (e) {
        alert("Error pada proses forgot password: " + e.message);
      }
    });
  }

  // Register form handler
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      
      try {
        const namaInput = $("#rNama");
        const emailInput = $("#rEmail");
        const passwordInput = $("#rPassword");
        const roleInput = $("#rRole");
        const lokasiInput = $("#rLokasi");

        if (!namaInput || !emailInput || !passwordInput || !roleInput || !lokasiInput) {
          alert("Error: Beberapa input tidak ditemukan pada form.");
          return;
        }

        const nama = namaInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const role = roleInput.value;
        const lokasi = lokasiInput.value.trim();

        if (!nama || !email || !password || !role || !lokasi) {
          alert("Mohon lengkapi semua field!");
          return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert("Format email tidak valid!");
          return;
        }

        // Password minimum length
        if (password.length < 6) {
          alert("Password minimal 6 karakter!");
          return;
        }

        if (!window.dataPengguna) {
          window.dataPengguna = [];
        }

        const users = window.dataPengguna;
        
        // Check email uniqueness
        if (users.some((u) => u.email === email)) {
          alert("Email sudah terdaftar! Gunakan email lain.");
          return;
        }

        // Generate new ID
        const newId = users.length > 0 ? Math.max(...users.map((u) => u.id || 0)) + 1 : 1;
        const newUser = { id: newId, nama, email, password, role, lokasi };
        users.push(newUser);

        // Persist to localStorage
        try {
          localStorage.setItem("sitta_dataPengguna", JSON.stringify(users));
          window.dataPengguna = users;
          
          alert("Pendaftaran berhasil! Anda dapat login sekarang.");
          closeModal("modalRegister");
          registerForm.reset();
        } catch (storageError) {
          alert("Error saat menyimpan data pendaftaran: " + storageError.message);
        }
      } catch (e) {
        alert("Error pada proses pendaftaran: " + e.message);
      }
    });
  }

  // Merge persisted users from localStorage
  (function mergePersisted() {
    try {
      const persist = localStorage.getItem("sitta_dataPengguna");
      if (persist) {
        const parsed = JSON.parse(persist);
        if (Array.isArray(parsed) && parsed.length > 0) {
          window.dataPengguna = parsed;
        }
      }
    } catch (e) {
      alert("Error saat memuat data tersimpan: " + e.message);
    }
  })();
})();
