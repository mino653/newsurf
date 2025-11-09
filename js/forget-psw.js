import {
    getState,
    getDB,
    setState,
    redirect,
    fetchWithTimeout
} from './util.js';
import './script.js';

EQuery(function () {
    const resetPswForm = EQuery('#reset-psw-form');
    const emailField = resetPswForm.find('#email');
    const submitBtn = resetPswForm.find('button[type=submit]');
    const error = resetPswForm.find('#error-message');
    const info = resetPswForm.find('#success-message');

    getDB(state => {
        if (state.userdata !== undefined && state.userdata.confirm_email) redirect('./');
    });

    EQuery('head').append(EQuery.elemt('style', `
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid var(--minecraft-gray);
            border-radius: 50%;
            border-top-color: var(--minecraft-white);
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes slideInDown {
            from {
                transform: translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `));

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    submitBtn.click(async function (e) {
        e.preventDefault();
        error.hide().text('');
        info.hide().text('');

        const spinner = resetPswForm.find('.spinner-outer').spinner();

        if (!isValidEmail(emailField.val())) {
            spinner.find('.e-spinner').remove();
            emailField.removeClass('shake').addClass('shake');
            error.show().css('animation: slideInDown 0.3s ease').text('Please enter a valid email address.');
            return;
        }
        
        EQuery(this).css('cursor: not-allowed').attr({disbled: true});

        const requestJSON = {
            "email": emailField.val(),
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const raw = JSON.stringify(requestJSON);
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetchWithTimeout(`/login/req-psw-reset-email`, requestOptions);
            spinner.find('.e-spinner').remove();

            if (response.detail === undefined) {
                info.show().css('animation: slideInDown 0.3s ease').text('Email sent successfully. Please check your inbox.');
                error.hide().text('');
            } else {
                error.show().css('animation: slideInDown 0.3s ease').text(response.detail.error || "An error occured while processing your request");
            }
            EQuery(this).css('cursor: default').attr({disbled: false});
        } catch (e) {
            spinner.find('.e-spinner').remove();
            error.show().css('animation: slideInDown 0.3s ease').text(e);
            EQuery(this).css('cursor: default').attr({disbled: false});
        }
    });

    EQuery('#toLogin').click(() => redirect('./login.html'));
});