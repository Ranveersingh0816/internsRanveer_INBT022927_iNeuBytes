/* ==========================================================
   Healthcare Management Dashboard – script.js
   Add this line just before </body> in your HTML:
   <script src="script.js"></script>
   ========================================================== */

(() => {
    'use strict';

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

    /* ---------------------------------------------------
       Helpers
    --------------------------------------------------- */
    const GOOD = ['confirmed', 'completed', 'available', 'active', 'done', 'paid'];
    const WARN = ['pending'];
    const BAD = ['cancelled', 'unavailable', 'unpaid', 'overdue'];

    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const headersOf = (table) => $$('thead th', table).map((th) => th.textContent.trim());

    function toneOf(text) {
        const t = text.trim().toLowerCase();
        if (GOOD.includes(t)) return 'good';
        if (WARN.includes(t)) return 'warn';
        if (BAD.includes(t)) return 'bad';
        return 'neutral';
    }

    function toast(message) {
        const el = document.createElement('div');
        el.className = 'toast';
        el.setAttribute('role', 'status');
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2500);
    }

    /* ---------------------------------------------------
       Status badges (Status / Availability / Payment status)
    --------------------------------------------------- */
    function applyBadges(table) {
        const cols = headersOf(table)
            .map((h, i) => (/status|availability/i.test(h) ? i : -1))
            .filter((i) => i >= 0);
        if (!cols.length) return;

        $$('tbody tr', table).forEach((tr) => {
            cols.forEach((i) => {
                const td = tr.children[i];
                if (!td) return;
                let badge = $('.badge', td);
                if (!badge) {
                    const text = td.textContent.trim();
                    if (!text) return;
                    badge = document.createElement('span');
                    badge.className = 'badge';
                    badge.textContent = text;
                    td.textContent = '';
                    td.appendChild(badge);
                }
                badge.dataset.tone = toneOf(badge.textContent);
            });
        });
    }

    /* Mark Delete / Cancel buttons as "danger" so they turn red */
    function styleActionButtons(root = document) {
        $$('td button', root).forEach((b) => {
            const t = b.textContent.trim().toLowerCase();
            if (t === 'delete' || t === 'cancel') b.dataset.role = 'danger';
        });
    }

    /* ---------------------------------------------------
       Table setup: wrap for scrolling + search box
    --------------------------------------------------- */
    function setupTables() {
        $$('main table').forEach((table) => {
            const wrap = document.createElement('div');
            wrap.className = 'table-wrap';
            table.parentNode.insertBefore(wrap, table);
            wrap.appendChild(table);

            applyBadges(table);

            // Toolbar: [+ Add button] [search]
            const container = wrap.parentElement;
            let addBtn = $$('button', container).find(
                (b) => !b.closest('table') && /^\+|add|book/i.test(b.textContent)
            );

            // Billing has no add button in the HTML, so create one
            const heading = $('h2, h3', container);
            if (!addBtn && heading && /billing/i.test(heading.textContent)) {
                addBtn = document.createElement('button');
                addBtn.type = 'button';
                addBtn.textContent = '+ Add Bill';
            }

            const tools = document.createElement('div');
            tools.className = 'table-tools';
            if (addBtn) {
                addBtn.dataset.addFor = '1';
                tools.appendChild(addBtn);
            }

            const search = document.createElement('input');
            search.type = 'search';
            search.className = 'table-search';
            search.placeholder = 'Search this table';
            search.setAttribute('aria-label', 'Search this table');
            search.addEventListener('input', () => {
                const q = search.value.trim().toLowerCase();
                $$('tbody tr', table).forEach((tr) => {
                    tr.hidden = q && !tr.textContent.toLowerCase().includes(q);
                });
            });
            tools.appendChild(search);

            wrap.parentNode.insertBefore(tools, wrap);
        });

        styleActionButtons();
    }

    /* ---------------------------------------------------
       Dialog (used for Add form and View details)
    --------------------------------------------------- */
    const dialog = document.createElement('dialog');
    document.body.appendChild(dialog);
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close(); // click on backdrop
    });

    function closeButton(label = 'Close') {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'secondary';
        b.textContent = label;
        b.addEventListener('click', () => dialog.close());
        return b;
    }

    /* ---- View a row ---- */
    function showRow(tr, table) {
        const heads = headersOf(table);
        const dl = document.createElement('dl');
        [...tr.children].forEach((td, i) => {
            if ($('button', td)) return;
            const dt = document.createElement('dt');
            dt.textContent = heads[i] || `Field ${i + 1}`;
            const dd = document.createElement('dd');
            dd.textContent = td.textContent.trim();
            dl.append(dt, dd);
        });

        const body = document.createElement('div');
        body.className = 'dialog-body';
        const h = document.createElement('h3');
        h.textContent = 'Details';
        const actions = document.createElement('div');
        actions.className = 'actions';
        actions.appendChild(closeButton());
        body.append(h, dl, actions);

        dialog.replaceChildren(body);
        dialog.showModal();
    }

    /* ---- Next ID like P003 -> P004 ---- */
    function nextId(table) {
        const rows = $$('tbody tr', table);
        const last = rows.length ? rows[rows.length - 1].children[0].textContent.trim() : '';
        const m = last.match(/^(\D*)(\d+)$/);
        if (!m) return '';
        const num = String(parseInt(m[2], 10) + 1).padStart(m[2].length, '0');
        return m[1] + num;
    }

    /* ---- Add a row ---- */
    function showAddForm(table, title) {
        const heads = headersOf(table);
        const form = document.createElement('form');
        const h = document.createElement('h3');
        h.textContent = title;
        const fields = document.createElement('div');
        fields.className = 'fields';

        heads.forEach((head, i) => {
            if (/^action$/i.test(head)) return;
            const label = document.createElement('label');
            label.textContent = cap(head);
            const input = document.createElement('input');
            input.name = String(i);
            input.required = true;

            if (/date/i.test(head)) input.type = 'date';
            else if (/^(age|quantity)$/i.test(head)) {
                input.type = 'number';
                input.min = '0';
            } else input.type = 'text';

            if (i === 0 && /id$/i.test(head)) input.value = nextId(table);
            label.appendChild(input);
            fields.appendChild(label);
        });

        const actions = document.createElement('div');
        actions.className = 'actions';
        const save = document.createElement('button');
        save.type = 'submit';
        save.textContent = 'Save';
        actions.append(closeButton('Cancel'), save);
        form.append(h, fields, actions);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const tr = document.createElement('tr');

            heads.forEach((head, i) => {
                const td = document.createElement('td');
                if (/^action$/i.test(head)) {
                    const sample = $('tbody tr td:last-child button', table);
                    if (sample) {
                        td.innerHTML = sample.closest('td').innerHTML;
                        $$('button', td).forEach((b) => b.removeAttribute('data-editing'));
                    } else {
                        td.innerHTML =
                            '<button type="button">View</button> <button type="button">Edit</button> <button type="button">Delete</button>';
                    }
                } else {
                    let value = form.elements[String(i)].value.trim();
                    if (/date/i.test(head) && value) {
                        value = new Date(value + 'T00:00:00').toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        });
                    }
                    td.textContent = value;
                }
                tr.appendChild(td);
            });

            ($('tbody', table) || table).appendChild(tr);
            applyBadges(table);
            styleActionButtons(tr);
            dialog.close();
            toast('Record added');
        });

        dialog.replaceChildren(form);
        dialog.showModal();
        const first = $('input', form);
        if (first) first.focus();
    }

    /* ---------------------------------------------------
       Row actions (event delegation)
    --------------------------------------------------- */
    function editableCells(tr) {
        return $$('td', tr).filter((td) => !$('button', td));
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn || !btn.closest('main')) return;

        const label = btn.textContent.trim().toLowerCase();
        const tr = btn.closest('tr');
        const table = btn.closest('table');

        /* "+ Add ..." buttons above a table */
        if (btn.dataset.addFor) {
            const t = $('table', btn.closest('.table-tools').parentElement);
            const name = btn.textContent.replace(/^\+\s*/, '').trim();
            if (t) showAddForm(t, cap(name));
            return;
        }

        if (!tr || !table || !btn.closest('tbody')) return;

        if (label === 'delete') {
            if (confirm('Delete this record?')) {
                tr.remove();
                toast('Record deleted');
            }
        } else if (label === 'view') {
            showRow(tr, table);
        } else if (label === 'add') {
            showAddForm(table, 'Add record');
        } else if (label === 'cancel') {
            const heads = headersOf(table);
            const idx = heads.findIndex((h) => /status/i.test(h));
            if (idx >= 0 && tr.children[idx]) {
                if (!confirm('Cancel this appointment?')) return;
                tr.children[idx].textContent = 'Cancelled';
                applyBadges(table);
                toast('Appointment cancelled');
            }
        } else if (label === 'edit' || label === 'save') {
            const editing = btn.dataset.editing === '1';
            editableCells(tr).forEach((td) => {
                td.contentEditable = editing ? 'false' : 'true';
                if (editing) td.removeAttribute('contenteditable');
            });
            if (editing) {
                // Re-wrap any status text that was typed over a badge
                $$('.badge', tr).forEach((b) => (b.dataset.tone = toneOf(b.textContent)));
                applyBadges(table);
                btn.textContent = 'Edit';
                btn.dataset.editing = '';
                toast('Changes saved');
            } else {
                btn.textContent = 'Save';
                btn.dataset.editing = '1';
                const first = editableCells(tr)[0];
                if (first) first.focus();
            }
        }
    });

    /* ---------------------------------------------------
       Sidebar navigation: smooth scroll + highlight
    --------------------------------------------------- */
    const rules = {
        dashboard: (t) => t === 'dashboard',
        doctors: (t) => t === 'doctor management',
        patients: (t) => t === 'patient management',
        appointments: (t) => t === 'appointment management',
        departments: (t) => t === 'departments',
        medicines: (t) => t === 'medicine management',
        billing: (t) => t === 'billing management',
        reports: (t) => t.startsWith('report'),
    };

    function targetFor(linkText) {
        const rule = rules[linkText.trim().toLowerCase()];
        if (!rule) return null;
        const h = $$('main h2, main h3').find((x) => rule(x.textContent.trim().toLowerCase()));
        return h ? h.parentElement : null;
    }

    const aside = $('aside');
    const links = $$('aside nav a').map((a) => ({ a, target: targetFor(a.textContent) }));

    links.forEach(({ a, target }) => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            if (target) target.scrollIntoView({ block: 'start' });
            if (aside) aside.classList.remove('open');
        });
    });

    let ticking = false;
    function updateActive() {
        ticking = false;
        let current = links[0];
        links.forEach((l) => {
            if (l.target && l.target.getBoundingClientRect().top <= 120) current = l;
        });
        // at the bottom of the page, highlight the last link
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
            current = links[links.length - 1];
        }
        links.forEach((l) => l.a.classList.toggle('active', l === current));
    }
    window.addEventListener(
        'scroll',
        () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateActive);
            }
        },
        { passive: true }
    );

    /* ---------------------------------------------------
       Mobile menu button
    --------------------------------------------------- */
    const header = $('body > header');
    if (header && aside) {
        const menu = document.createElement('button');
        menu.type = 'button';
        menu.className = 'menu-btn';
        menu.setAttribute('aria-label', 'Toggle menu');
        menu.textContent = '☰';
        menu.addEventListener('click', () => aside.classList.toggle('open'));
        header.prepend(menu);
    }

    /* ---------------------------------------------------
       Admin photo fallback (if the image file is missing)
    --------------------------------------------------- */
    const avatar = $('main img');
    if (avatar) {
        avatar.alt = avatar.alt || 'Admin profile photo';
        const fallback =
            'data:image/svg+xml;utf8,' +
            encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">' +
                    '<rect width="96" height="96" fill="#e8f4f2"/>' +
                    '<circle cx="48" cy="38" r="16" fill="#0f7f77"/>' +
                    '<path d="M16 88c4-20 18-28 32-28s28 8 32 28z" fill="#0f7f77"/></svg>'
            );
        avatar.addEventListener('error', () => {
            avatar.src = fallback;
        }, { once: true });
    }

    /* ---------------------------------------------------
       Footer links (placeholders)
    --------------------------------------------------- */
    $$('footer p').slice(1).forEach((p) => {
        p.addEventListener('click', () => toast(p.textContent.trim() + ' page coming soon'));
    });

    /* ---------------------------------------------------
       Init
    --------------------------------------------------- */
    setupTables();
    updateActive();
})();
