"use client";

import { FormEvent, MouseEvent, useRef, useState } from "react";
import RevealOnScroll from "./ui/RevealOnScroll";

export default function Contact() {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [form, setForm] = useState({
    name: "",
    company: "",
    contact: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.transform = `translate(${(x - r.width / 2) * 0.2}px, ${(y - r.height / 2) * 0.2}px)`;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  const onLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = "translate(0,0)";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setStatus("sent");
      setForm({ name: "", company: "", contact: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="contact-section" id="contact">
      <RevealOnScroll className="tag">Kontakt</RevealOnScroll>
      <RevealOnScroll as="h2" className="big-title" delay={1}>
        <>
          Zróbmy Twoją
          <br />
          <em>stronę</em> razem.
        </>
      </RevealOnScroll>
      <div className="contact-grid">
        <RevealOnScroll className="contact-info" delay={2}>
          <p className="contact-desc">
            Opisz krótko czego potrzebujesz, a odezwiemy się w ciągu 24 godzin z
            bezpłatną wyceną. Bez zobowiązań.
          </p>
          <a href="https://wa.me/48731531571" className="contact-option">
            <div className="co-icon wa">💬</div>
            <div>
              <div className="co-label">WhatsApp / Telefon</div>
              <div className="co-value">+48 731 531 571</div>
            </div>
          </a>
          <a href="mailto:nikodem@sandnstudio.art" className="contact-option">
            <div className="co-icon em">✉️</div>
            <div>
              <div className="co-label">E-mail</div>
              <div className="co-value">nikodem@sandnstudio.art</div>
            </div>
          </a>
        </RevealOnScroll>
        <RevealOnScroll className="contact-form-wrap" delay={3}>
          <div className="cf-title">Wyślij wiadomość</div>
          <form onSubmit={handleSubmit}>
            <div className="cf-row">
              <div className="cf-group">
                <label className="cf-label">Imię i nazwisko</label>
                <input
                  type="text"
                  className="cf-input"
                  placeholder="Jan Kowalski"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="cf-group">
                <label className="cf-label">Firma</label>
                <input
                  type="text"
                  className="cf-input"
                  placeholder="Nazwa firmy"
                  value={form.company}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, company: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="cf-group">
              <label className="cf-label">E-mail lub telefon</label>
              <input
                type="text"
                className="cf-input"
                placeholder="jan@firma.pl lub +48 000 000 000"
                required
                value={form.contact}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contact: e.target.value }))
                }
              />
            </div>
            <div className="cf-group">
              <label className="cf-label">Czego potrzebujesz?</label>
              <textarea
                className="cf-textarea"
                placeholder="Opisz krótko swój biznes i co chciałbyś osiągnąć dzięki nowej stronie..."
                required
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
              />
            </div>
            <button
              type="submit"
              className="cf-submit"
              ref={btnRef}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              disabled={status === "sending"}
            >
              {status === "sending"
                ? "Wysyłanie..."
                : status === "sent"
                  ? "Wysłano! ✓"
                  : "Wyślij wiadomość →"}
            </button>
            {status === "error" && (
              <p className="cf-note" style={{ color: "#ef4444" }}>
                Nie udało się wysłać. Spróbuj ponownie lub napisz bezpośrednio
                na maila.
              </p>
            )}
            {status !== "error" && (
              <p className="cf-note">
                Bezpłatna wycena · Odpowiedź w 24h · Zero zobowiązań
              </p>
            )}
          </form>
        </RevealOnScroll>
      </div>
    </section>
  );
}
