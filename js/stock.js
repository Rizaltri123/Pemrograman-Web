// js/stock.js - Modern stock management with image display
(function () {
  try {
    // DOM Elements
    const gridView = document.getElementById("gridView");
    const tableView = document.getElementById("tableView");
    const tbody = document.querySelector("#stokTable tbody");
    const addBtn = document.getElementById("addBtn");
    const modal = document.getElementById("modalAdd");
    const closeBtn = modal ? modal.querySelector(".close") : null;
    const form = document.getElementById("addForm");
    const gridViewBtn = document.getElementById("gridViewBtn");
    const tableViewBtn = document.getElementById("tableViewBtn");
    const totalBooksSpan = document.getElementById("totalBooks");

    // Validate DOM elements
    if (!gridView || !tableView || !tbody) {
      alert("Error: Elemen tampilan tidak ditemukan!");
      return;
    }
    if (!addBtn || !modal || !form) {
      alert("Error: Elemen form tidak ditemukan!");
      return;
    }

    // Current view state
    let currentView = "grid"; // 'grid' or 'table'

    // Load data in grid view (with images)
    function loadGridView() {
      try {
        gridView.innerHTML = "";

        if (!window.dataBahanAjar) {
          alert("Peringatan: Data bahan ajar belum dimuat.");
          window.dataBahanAjar = [];
          return;
        }

        const items = window.dataBahanAjar;

        if (items.length === 0) {
          gridView.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 40px;">Belum ada data bahan ajar</p>';
          return;
        }

        // Update total count
        if (totalBooksSpan) {
          totalBooksSpan.textContent = items.length;
        }

        items.forEach((item, index) => {
          try {
            const card = document.createElement("div");
            card.className = "book-card";

            // Determine stock status
            let stockClass = "";
            let stockText = item.stok || 0;
            if (stockText === 0) {
              stockClass = "out";
              stockText = "Habis";
            } else if (stockText < 100) {
              stockClass = "low";
            }

            // Create image element
            const imgSrc = item.cover || "img/placeholder.jpg";
            
            card.innerHTML = `
              <img 
                class="book-cover" 
                src="${imgSrc}" 
                alt="${item.namaBarang || 'Bahan Ajar'}"
                onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22320%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22280%22 height=%22320%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2248%22 fill=%22%236b7280%22%3E📚%3C/text%3E%3C/svg%3E';"
              />
              <div class="book-info">
                <div class="book-title">${item.namaBarang || "-"}</div>
                <div class="book-meta">
                  <div class="book-meta-item">
                    <span class="book-meta-label">Kode:</span>
                    <span>${item.kodeBarang || "-"}</span>
                  </div>
                  <div class="book-meta-item">
                    <span class="book-meta-label">Lokasi:</span>
                    <span>${item.kodeLokasi || "-"}</span>
                  </div>
                  <div class="book-meta-item">
                    <span class="book-meta-label">Edisi:</span>
                    <span>${item.edisi || "-"}</span>
                  </div>
                  <div class="book-meta-item">
                    <span class="book-meta-label">Stok:</span>
                    <span class="book-stock ${stockClass}">${stockText}</span>
                  </div>
                </div>
              </div>
            `;

            gridView.appendChild(card);
          } catch (cardError) {
            alert("Error saat menampilkan item #" + (index + 1) + ": " + cardError.message);
          }
        });
      } catch (e) {
        alert("Error saat memuat tampilan grid: " + e.message);
      }
    }

    // Load data in table view
    function loadTableView() {
      try {
        tbody.innerHTML = "";

        if (!window.dataBahanAjar) {
          alert("Peringatan: Data bahan ajar belum dimuat.");
          window.dataBahanAjar = [];
          return;
        }

        const items = window.dataBahanAjar;

        if (items.length === 0) {
          const tr = document.createElement("tr");
          tr.innerHTML = '<td colspan="7" style="text-align:center">Belum ada data bahan ajar</td>';
          tbody.appendChild(tr);
          return;
        }

        // Update total count
        if (totalBooksSpan) {
          totalBooksSpan.textContent = items.length;
        }

        items.forEach((item, index) => {
          try {
            const tr = document.createElement("tr");
            
            // Create thumbnail cell
            const imgSrc = item.cover || "img/placeholder.jpg";
            const thumbnailHtml = `
              <img 
                src="${imgSrc}" 
                alt="Cover" 
                style="width: 50px; height: 60px; object-fit: cover; border-radius: 4px;"
                onerror="this.onerror=null; this.innerHTML='📚';"
              />
            `;

            tr.innerHTML = `
              <td>${thumbnailHtml}</td>
              <td>${item.kodeLokasi || "-"}</td>
              <td>${item.kodeBarang || "-"}</td>
              <td><strong>${item.namaBarang || "-"}</strong></td>
              <td>${item.jenisBarang || "-"}</td>
              <td>${item.edisi || "-"}</td>
              <td><strong>${item.stok !== undefined ? item.stok : "-"}</strong></td>
            `;
            tbody.appendChild(tr);
          } catch (rowError) {
            alert("Error saat menambahkan baris #" + (index + 1) + ": " + rowError.message);
          }
        });
      } catch (e) {
        alert("Error saat memuat tampilan tabel: " + e.message);
      }
    }

    // Switch between views
    function switchView(view) {
      try {
        currentView = view;

        if (view === "grid") {
          gridView.style.display = "grid";
          tableView.style.display = "none";
          gridViewBtn.classList.add("active");
          tableViewBtn.classList.remove("active");
          loadGridView();
        } else {
          gridView.style.display = "none";
          tableView.style.display = "block";
          gridViewBtn.classList.remove("active");
          tableViewBtn.classList.add("active");
          loadTableView();
        }
      } catch (e) {
        alert("Error saat mengganti tampilan: " + e.message);
      }
    }

    // View toggle buttons
    if (gridViewBtn) {
      gridViewBtn.addEventListener("click", () => switchView("grid"));
    }
    if (tableViewBtn) {
      tableViewBtn.addEventListener("click", () => switchView("table"));
    }

    // Modal handlers
    addBtn.addEventListener("click", () => {
      try {
        modal.style.display = "block";
      } catch (e) {
        alert("Error saat membuka modal: " + e.message);
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        try {
          modal.style.display = "none";
        } catch (e) {
          alert("Error saat menutup modal: " + e.message);
        }
      });
    }

    window.addEventListener("click", (e) => {
      try {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      } catch (err) {
        alert("Error pada event click: " + err.message);
      }
    });

    // Form submit handler
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      try {
        const kodeLokInput = document.getElementById("kodeLok");
        const kodeBrgInput = document.getElementById("kodeBrg");
        const namaBrgInput = document.getElementById("namaBrg");
        const jenisBrgInput = document.getElementById("jenisBrg");
        const edisiBrgInput = document.getElementById("edisiBrg");
        const stokBrgInput = document.getElementById("stokBrg");

        // Validate input elements
        if (
          !kodeLokInput ||
          !kodeBrgInput ||
          !namaBrgInput ||
          !jenisBrgInput ||
          !edisiBrgInput ||
          !stokBrgInput
        ) {
          alert("Error: Beberapa input tidak ditemukan pada form.");
          return;
        }

        const kodeLok = kodeLokInput.value.trim();
        const kodeBrg = kodeBrgInput.value.trim();
        const namaBrg = namaBrgInput.value.trim();
        const jenisBrg = jenisBrgInput.value.trim();
        const edisiBrg = edisiBrgInput.value.trim();
        const stokBrg = parseInt(stokBrgInput.value, 10);

        // Validate fields
        if (!kodeLok || !kodeBrg || !namaBrg || !jenisBrg || !edisiBrg) {
          alert("Mohon lengkapi semua field!");
          return;
        }

        if (Number.isNaN(stokBrg) || stokBrg < 0) {
          alert("Stok harus berupa angka positif!");
          return;
        }

        if (kodeLok.length < 5) {
          alert("Kode lokasi minimal 5 karakter!");
          return;
        }

        if (kodeBrg.length < 6) {
          alert("Kode barang minimal 6 karakter!");
          return;
        }

        const newItem = {
          kodeLokasi: kodeLok,
          kodeBarang: kodeBrg,
          namaBarang: namaBrg,
          jenisBarang: jenisBrg,
          edisi: edisiBrg,
          stok: stokBrg,
          cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='320'%3E%3Crect fill='%23e5e7eb' width='280' height='320'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='48' fill='%239ca3af'%3E📚%3C/text%3E%3C/svg%3E"
        };

        // Initialize if needed
        if (!window.dataBahanAjar) {
          window.dataBahanAjar = [];
        }

        // Check duplicate
        if (window.dataBahanAjar.some((item) => item.kodeBarang === kodeBrg)) {
          alert("Kode barang sudah ada! Gunakan kode yang berbeda.");
          return;
        }

        // Add to array
        window.dataBahanAjar.push(newItem);

        // Persist to localStorage
        try {
          localStorage.setItem(
            "sitta_dataBahanAjar",
            JSON.stringify(window.dataBahanAjar)
          );
        } catch (storageError) {
          alert(
            "Peringatan: Data berhasil ditambahkan tetapi tidak dapat disimpan: " +
              storageError.message
          );
        }

        // Reload current view
        if (currentView === "grid") {
          loadGridView();
        } else {
          loadTableView();
        }

        modal.style.display = "none";
        form.reset();
        alert("Bahan ajar berhasil ditambahkan!");
      } catch (e) {
        alert("Error saat menambahkan data: " + e.message);
      }
    });

    // Load persisted data
    (function loadPersisted() {
      try {
        const persist = localStorage.getItem("sitta_dataBahanAjar");
        if (persist) {
          const parsed = JSON.parse(persist);
          if (Array.isArray(parsed) && parsed.length > 0) {
            window.dataBahanAjar = parsed;
          }
        }
      } catch (e) {
        alert("Error saat memuat data tersimpan: " + e.message);
      }
    })();

    // Initial load - grid view by default
    switchView("grid");
  } catch (e) {
    alert("Error fatal saat inisialisasi halaman stok: " + e.message);
  }
})();
