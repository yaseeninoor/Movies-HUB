(() => {
  const grid = document.getElementById("rssGrid");
  const status = document.getElementById("rssStatus");
  if (!grid || !status) return;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const validHttps = value => { try { const u = new URL(value); return u.protocol === "https:" ? u.href : ""; } catch { return ""; } };
  const dateLabel = value => {
    if (!value) return "LATEST";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? escapeHtml(value.slice(0, 50)) : d.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});
  };
  fetch("data/rss-feed.json?v=" + Date.now(), {cache:"no-store"})
    .then(response => { if (!response.ok) throw new Error("feed data not found"); return response.json(); })
    .then(data => {
      const items = Array.isArray(data.items) ? data.items : [];
      if (!items.length) {
        status.textContent = data.message || "No feed items yet. The RSS feed may be unavailable or needs to be configured.";
        grid.innerHTML = '<div class="rss-empty">RSS is connected to the LOOP feed reader, but no items were returned. Check the feed URL and run the RSS refresh workflow in GitHub Actions.</div>';
        return;
      }
      status.textContent = "Showing " + items.length + " recent posts · Last refresh: " + dateLabel(data.updatedAt);
      grid.innerHTML = items.map(item => {
        const url = validHttps(item.url);
        if (!url) return "";
        const image = validHttps(item.image);
        const category = Array.isArray(item.categories) && item.categories.length ? item.categories.slice(0,2).join(" · ") : "SOURCE FEED";
        return '<article class="rss-card">' +
          (image ? '<img src="' + escapeHtml(image) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">' : '') +
          '<div class="rss-card-body"><div class="rss-card-meta">' + escapeHtml(category) + ' · ' + dateLabel(item.published) + '</div>' +
          '<h3>' + escapeHtml(item.title) + '</h3>' +
          (item.description ? '<p>' + escapeHtml(item.description) + '</p>' : '<p>Open the original publisher to view this post and its available media.</p>') +
          '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">Open original post ↗</a></div></article>';
      }).join("");
    })
    .catch(() => {
      status.textContent = "Feed catalogue has not been generated yet.";
      grid.innerHTML = '<div class="rss-empty">The automatic RSS catalogue will appear here after the GitHub Actions refresh runs successfully.</div>';
    });
})();