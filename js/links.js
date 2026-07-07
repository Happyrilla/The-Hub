document.addEventListener("DOMContentLoaded", function () {
    const dialog = document.getElementById("dialog")
    const form = document.getElementById("customLinkForm")
    const nameInput = document.getElementById("customLinkName")
    const urlInput = document.getElementById("customLinkUrl")
    const list = document.getElementById("customLinksList")
    const a = document.getElementById("1")
    const b = document.getElementById("2")
    const STORAGE_KEY = "customLinks"

    if (!a || !b) return

    function showSection(target) {
        a.style.display = "none"
        b.style.display = "none"
        target.style.display = "flex"
    }

    function pick(value) {
        const target = typeof value === "string" ? document.getElementById(value) : value
        if (!target) return

        showSection(target)
        localStorage.setItem("localchoise", target.id)

        const picker = document.getElementById("sectionPicker")
        if (picker) {
            picker.value = target.id
        }
    }

    function normalizeUrl(url) {
        const trimmed = url.trim()
        if (!trimmed) return ""

        return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    }

    function getFaviconUrl(url) {
        try {
            const parsed = new URL(normalizeUrl(url))
            return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(parsed.hostname)}&sz=64`
        } catch (error) {
            return ""
        }
    }

    function getStoredLinks() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
            return Array.isArray(saved) ? saved : []
        } catch (error) {
            return []
        }
    }

    function saveStoredLinks(links) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(links))
    }

    function renderCustomLinks() {
        if (!list) return

        const links = getStoredLinks()
        list.innerHTML = ""

        links.forEach((link) => {
            const item = document.createElement("div")
            item.className = "custom-link-item"

            const ball = document.createElement("div")
            ball.className = "linko"

            const anchor = document.createElement("a")
            anchor.href = normalizeUrl(link.url || "")
            anchor.target = "_blank"
            anchor.rel = "noopener noreferrer"

            const icon = document.createElement("img")
            icon.className = "link-favicon"
            icon.src = getFaviconUrl(link.url || "")
            icon.alt = link.name || "Untitled"
            icon.loading = "lazy"

            anchor.appendChild(icon)
            ball.appendChild(anchor)

            const label = document.createElement("div")
            label.className = "link-label"
            label.textContent = link.name || "Untitled"

            item.appendChild(ball)
            item.appendChild(label)
            list.appendChild(item)
        })
    }

    function addlink() {
        if (dialog) {
            if (form) {
                form.reset()
            }
            dialog.showModal()
        }
    }

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault()

            const name = nameInput?.value.trim() || ""
            const url = urlInput?.value.trim() || ""

            if (!name || !url) return

            const links = getStoredLinks()
            links.push({ name, url: normalizeUrl(url) })
            saveStoredLinks(links)

            renderCustomLinks()
            if (dialog) {
                dialog.close()
            }
        })
    }

    window.addlink = addlink

    const picker = document.getElementById("sectionPicker")
    if (picker) {
        picker.value = "1"
    }

    showSection(a)

    renderCustomLinks()
    window.pick = pick
})
