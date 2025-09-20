document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contactV2__form');
    if (!contactForm) return;

    // --- EmailJS Configuration ---
    const SERVICE_ID = 'service_3p59wm5'; // Replace with your EmailJS Service ID
    const TEMPLATE_ID = 'template_r4mh03o'; // Replace with your EmailJS Template ID
    const PUBLIC_KEY = 'IUVaCHfzTD_E45-Ni';   

    const submitButton = contactForm.querySelector('.contactV2__submit');
    const submitButtonText = submitButton.querySelector('span');

    const fields = {
        name: contactForm.querySelector('#contact-name'),
        email: contactForm.querySelector('#contact-email'),
        subject: contactForm.querySelector('#contact-subject'),
        message: contactForm.querySelector('#contact-message'),
    };

    const clearErrors = () => {
        Object.values(fields).forEach(field => {
            field.classList.remove('contactV2__input--error');
            const errorEl = field.parentElement.querySelector('.contactV2__error');
            if (errorEl) errorEl.remove();
        });
    };

    const showError = (field, message) => {
        field.classList.add('contactV2__input--error');
        let errorEl = field.parentElement.querySelector('.contactV2__error');
        if (!errorEl) {
            errorEl = document.createElement('p');
            errorEl.className = 'contactV2__error';
            field.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    };

    const validateForm = () => {
        clearErrors();
        let isValid = true;

        if (!fields.name.value.trim()) {
            showError(fields.name, 'Please enter your name.');
            isValid = false;
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!fields.email.value.trim()) {
            showError(fields.email, 'Please enter your email address.');
            isValid = false;
        } else if (!emailRegex.test(fields.email.value.trim())) {
            showError(fields.email, 'Please enter a valid email address.');
            isValid = false;
        }

        if (!fields.subject.value.trim()) {
            showError(fields.subject, 'Please enter a subject.');
            isValid = false;
        }

        if (!fields.message.value.trim()) {
            showError(fields.message, 'Please enter your message.');
            isValid = false;
        }

        return isValid;
    };

    const showNotification = (message, isSuccess = true) => {
        const notification = document.createElement('div');
        notification.className = `notification ${isSuccess ? 'notification--success' : 'notification--error'}`;

        const iconClass = isSuccess ? 'fa-check-circle' : 'fa-exclamation-triangle';

        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas ${iconClass} notification__icon"></i>
                <p class="notification__message">${message}</p>
                <button class="notification__close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('notification--show'), 10);

        // Auto-dismiss
        const timer = setTimeout(() => {
            notification.classList.remove('notification--show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Manual close
        notification.querySelector('.notification__close').addEventListener('click', () => {
            clearTimeout(timer);
            notification.classList.remove('notification--show');
            setTimeout(() => notification.remove(), 300);
        });
    };

    const setLoadingState = (isLoading) => {
        if (isLoading) {
            submitButton.disabled = true;
            submitButtonText.textContent = 'Sending...';
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            submitButton.appendChild(spinner);
        } else {
            submitButton.disabled = false;
            submitButtonText.textContent = 'Send Message';
            const spinner = submitButton.querySelector('.loading-spinner');
            if (spinner) spinner.remove();
        }
    };

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoadingState(true);

        const templateParams = {
            name: fields.name.value.trim(),
            email: fields.email.value.trim(),
            subject: fields.subject.value.trim(),
            message: fields.message.value.trim(),
        };

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                setLoadingState(false);
                showNotification('Your message has been sent successfully!', true);
                contactForm.reset();
                clearErrors();
            }, (error) => {
                console.error('FAILED...', error);
                setLoadingState(false);
                showNotification('Failed to send message. Please try again later.', false);
            });
    });
});
