class Validator {
    static notEmpty = v => v.trim().length > 0;
    static minLength = (v, n) => v.trim().length >= n;
    static isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
    static isPhone = v => /^\d{9}$/.test(v.replace(/\D/g, "").replace(/^48/, ""));
    static isZip = v => /^\d{2}-\d{3}$/.test(v.trim());
}

class FieldValidator {
    static config = {
        firstName: [
            [Validator.notEmpty, "Imię jest wymagane"],
            [v => Validator.minLength(v, 2), "Minimum 2 znaki"]
        ],
        lastName: [
            [Validator.notEmpty, "Nazwisko jest wymagane"],
            [v => Validator.minLength(v, 2), "Minimum 2 znaki"]
        ],
        email: [
            [Validator.notEmpty, "Email jest wymagany"],
            [Validator.isEmail, "Niepoprawny email"]
        ],
        phone: [
            [Validator.notEmpty, "Telefon jest wymagany"],
            [Validator.isPhone, "Niepoprawny numer"]
        ],
        street: [[Validator.notEmpty, "Adres jest wymagany"]],
        zip: [
            [Validator.notEmpty, "Kod pocztowy jest wymagany"],
            [Validator.isZip, "Format XX-XXX"]
        ],
        city: [[Validator.notEmpty, "Miasto jest wymagane"]]
    };

    static validate(field) {
        const input = document.getElementById(field);
        if (!input) return null;
        
        for (const [rule, msg] of this.config[field]) {
            if (!rule(input.value)) return msg;
        }
      
        return null;
    }

    static show(field, error) {
        const input = document.getElementById(field);
        const id = `error-${field}`;

        document.getElementById(id)?.remove();

        input.classList.toggle("is-invalid", !!error);
        input.classList.toggle("is-valid", !error);

        if (!error) return;

        const div = document.createElement("div");
        div.id = id;
        div.className = "invalid-feedback";
        div.textContent = error;

        input.parentNode.append(div);
    }

    static validateField(field) {
        const error = this.validate(field);
        this.show(field, error);
        return !error;
    }

    static validateAll() {
        return Object.keys(this.config).every(f => this.validateField(f));
    }
}

class AjaxService {
    static async send(data) {
        return new Promise((resolve, reject) => {
            console.log("Wysyłanie:", data);

            setTimeout(() => {
                Math.random() > 0.1
                ? resolve({
                    ok: true,
                    order: `#${Math.floor(Math.random() * 9000 + 1000)}`
                })
                : reject("Błąd serwera");
            }, 1000);
        });
    }
}

class CheckoutForm {
    fields = ["firstName", "lastName", "email", "phone", "street", "zip", "city"];

    constructor() {
        this.btn = document.querySelector(".btn-primary");
        this.status = document.createElement("div");

        document.querySelector(".order-summary")?.prepend(this.status);

        this.init();
    }

    init() {
        this.fields.forEach(f => {
            const input = document.getElementById(f);
            if (!input) return;

            input.addEventListener("blur", () => FieldValidator.validateField(f));

            input.addEventListener("input", () => {
                if (input.classList.contains("is-invalid")) {
                    FieldValidator.validateField(f);
                }
            });
        });

        document.getElementById("zip")?.addEventListener("input", e => {
            let v = e.target.value.replace(/\D/g, "");

            if (v.length > 2) {
                v = v.slice(0,2) + '-' + v.slice(2,5);
            }

            e.target.value = v;
        });

        this.btn?.addEventListener("click", e => {
            e.preventDefault();
            this.submit();
        });
    }

    getData() {
        return Object.fromEntries(
            this.fields.map(f => [f, document.getElementById(f)?.value.trim()])
        );
    }

    setStatus(type, msg) {
        this.status.className = `alert alert-${type}`;
        this.status.textContent = msg;
    }

    async submit() {
        if (!FieldValidator.validateAll()) {
            return this.setStatus("danger", "Popraw formularz");
        }

        this.btn.disabled = true;
        this.btn.textContent = "Wysyłanie...";

        try {
            const res = await AjaxService.send(this.getData());
            this.setStatus("success", `Zamówienie ${res.order} przyjęte`);
            this.btn.textContent = "Gotowe ✓";
        } catch {
            this.setStatus("danger", "Błąd wysyłki");
            this.btn.disabled = false;
            this.btn.textContent = "Zamawiam";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new CheckoutForm();
});