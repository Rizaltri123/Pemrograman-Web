// js/tracking.js - Modern tracking with timeline view
(function () {
  try {
    const form = document.getElementById("trackForm");
    const result = document.getElementById("trackResult");

    // Validate DOM elements
    if (!form) {
      alert("Error: Form tracking tidak ditemukan!");
      return;
    }
    if (!result) {
      alert("Error: Elemen hasil tracking tidak ditemukan!");
      return;
    }

    // Render tracking information with modern design
    function renderTracking(tr) {
      try {
        if (!tr) {
          return '<p class="small">Data tracking tidak tersedia.</p>';
        }

        // Validate data
        if (!tr.nomorDO) {
          return '<p class="small">Error: Nomor DO tidak tersedia.</p>';
        }

        // Determine status badge color
        let statusBadge = "";
        if (tr.status && tr.status.toLowerCase().includes("selesai")) {
          statusBadge = "background: var(--secondary); color: white;";
        } else if (tr.status && tr.status.toLowerCase().includes("dalam perjalanan")) {
          statusBadge = "background: var(--accent); color: white;";
        } else {
          statusBadge = "background: var(--primary); color: white;";
        }

        // Build tracking card
        const trackingHtml = `
          <section class="card" style="margin-top: 24px; animation: slideUp 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
              <div>
                <h2 style="margin: 0; font-size: 24px;">Informasi Pengiriman</h2>
                <p class="small" style="margin-top: 4px;">Nomor DO: <strong>${tr.nomorDO || "-"}</strong></p>
              </div>
              <div style="padding: 8px 20px; border-radius: 20px; font-weight: 600; ${statusBadge}">
                ${tr.status || "Unknown"}
              </div>
            </div>

            <!-- Details Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
              <div style="padding: 16px; background: var(--gray-light); border-radius: 8px;">
                <div class="small" style="margin-bottom: 4px;">👤 Nama Penerima</div>
                <div style="font-weight: 600;">${tr.nama || "-"}</div>
              </div>
              <div style="padding: 16px; background: var(--gray-light); border-radius: 8px;">
                <div class="small" style="margin-bottom: 4px;">🚚 Ekspedisi</div>
                <div style="font-weight: 600;">${tr.ekspedisi || "-"}</div>
              </div>
              <div style="padding: 16px; background: var(--gray-light); border-radius: 8px;">
                <div class="small" style="margin-bottom: 4px;">📅 Tanggal Kirim</div>
                <div style="font-weight: 600;">${tr.tanggalKirim || "-"}</div>
              </div>
              <div style="padding: 16px; background: var(--gray-light); border-radius: 8px;">
                <div class="small" style="margin-bottom: 4px;">📦 Paket</div>
                <div style="font-weight: 600;">${tr.paket || "-"}</div>
              </div>
              <div style="padding: 16px; background: var(--gray-light); border-radius: 8px;">
                <div class="small" style="margin-bottom: 4px;">💰 Total</div>
                <div style="font-weight: 600; color: var(--primary);">${tr.total || "-"}</div>
              </div>
            </div>

            <hr style="border: none; border-top: 2px solid var(--gray-light); margin: 24px 0;" />

            <!-- Timeline -->
            <h3 style="margin-bottom: 20px;">📍 Riwayat Perjalanan</h3>
            ${renderTimeline(tr.perjalanan)}
          </section>
        `;
        return trackingHtml;
      } catch (e) {
        alert("Error saat render tracking: " + e.message);
        return '<p class="small">Error saat menampilkan data tracking.</p>';
      }
    }

    // Render timeline for journey history
    function renderTimeline(perjalanan) {
      try {
        if (!perjalanan || !Array.isArray(perjalanan) || perjalanan.length === 0) {
          return '<p class="small">Belum ada riwayat perjalanan.</p>';
        }

        const timelineItems = perjalanan
          .map((p, index) => {
            try {
              const isLast = index === perjalanan.length - 1;
              const isFirst = index === 0;
              
              // Different color for different stages
              let dotColor = "var(--gray)";
              if (isLast) dotColor = "var(--secondary)";
              else if (isFirst) dotColor = "var(--primary)";

              return `
                <div style="display: flex; gap: 16px; margin-bottom: ${isLast ? "0" : "20px"}; position: relative;">
                  <!-- Timeline dot and line -->
                  <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: ${dotColor}; z-index: 2;"></div>
                    ${!isLast ? `<div style="width: 2px; flex: 1; background: var(--gray-light); margin-top: 4px;"></div>` : ""}
                  </div>
                  
                  <!-- Content -->
                  <div style="flex: 1; padding-bottom: 4px;">
                    <div style="font-size: 12px; color: var(--gray); margin-bottom: 4px;">
                      ⏰ ${p.waktu || "-"}
                    </div>
                    <div style="font-weight: ${isLast ? "600" : "500"}; color: ${isLast ? "var(--secondary)" : "var(--dark)"};">
                      ${p.keterangan || "-"}
                    </div>
                  </div>
                </div>
              `;
            } catch (itemError) {
              alert("Error saat render item perjalanan #" + (index + 1) + ": " + itemError.message);
              return '<div class="small">Error pada data perjalanan</div>';
            }
          })
          .join("");

        return `<div style="padding: 20px; background: var(--gray-light); border-radius: 8px;">${timelineItems}</div>`;
      } catch (e) {
        alert("Error saat render riwayat perjalanan: " + e.message);
        return '<p class="small">Error saat menampilkan riwayat perjalanan.</p>';
      }
    }

    // Form submit handler
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      try {
        const doInput = document.getElementById("doNumber");
        if (!doInput) {
          alert("Error: Input nomor DO tidak ditemukan!");
          return;
        }

        const doNum = doInput.value.trim();

        if (!doNum) {
          alert("Mohon masukkan nomor DO!");
          return;
        }

        // Validate format (10 digits)
        if (doNum.length !== 10 || !/^\d+$/.test(doNum)) {
          alert("Format nomor DO tidak valid! Harus 10 digit angka.");
          return;
        }

        // Check if dataTracking exists
        if (!window.dataTracking) {
          alert("Error: Data tracking tidak tersedia. Pastikan file data.js sudah dimuat.");
          result.innerHTML = '<section class="card" style="margin-top: 24px;"><p class="small">Data tracking tidak tersedia.</p></section>';
          return;
        }

        const dt = window.dataTracking;

        // Try direct lookup
        let found = dt[doNum];

        if (!found) {
          // Try to find by nomorDO property
          try {
            const values = Object.values(dt);
            found = values.find((v) => v && v.nomorDO === doNum);
          } catch (searchError) {
            alert("Error saat mencari data: " + searchError.message);
          }
        }

        if (!found) {
          alert("Nomor DO '" + doNum + "' tidak ditemukan dalam sistem!");
          result.innerHTML = `
            <section class="card" style="margin-top: 24px;">
              <div style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 64px; margin-bottom: 16px;">📭</div>
                <h3 style="margin-bottom: 8px;">Data Tidak Ditemukan</h3>
                <p class="small">Nomor DO <strong>${doNum}</strong> tidak terdaftar dalam sistem.</p>
                <p class="small" style="margin-top: 12px;">Pastikan nomor DO yang Anda masukkan sudah benar.</p>
              </div>
            </section>
          `;
          return;
        }

        // Render result
        result.innerHTML = renderTracking(found);
        
        // Scroll to result
        result.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } catch (e) {
        alert("Error saat proses tracking: " + e.message);
        result.innerHTML = '<section class="card" style="margin-top: 24px;"><p class="small">Terjadi kesalahan saat memproses data.</p></section>';
      }
    });

    // Validate data on load
    (function validateData() {
      try {
        if (!window.dataTracking) {
          alert("Peringatan: Data tracking belum dimuat. Pastikan file data.js sudah dimuat dengan benar.");
          return;
        }

        const trackingKeys = Object.keys(window.dataTracking);
        if (trackingKeys.length === 0) {
          alert("Peringatan: Belum ada data tracking tersedia.");
        }
      } catch (e) {
        alert("Error saat validasi data tracking: " + e.message);
      }
    })();
  } catch (e) {
    alert("Error fatal saat inisialisasi halaman tracking: " + e.message);
  }
})();
