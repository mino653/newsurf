import {
    getState,
    getDB,
    setState,
    redirect,
    fetchWithTimeout
} from './util.js';
import './script.js';

EQuery(function () {
    const loginForm = EQuery('#login-form');
    const emailField = loginForm.find('#email');
    const pswField = loginForm.find('#password');
    const showPsw = loginForm.find('#togglePsw');
    const submitBtn = loginForm.find('button[type=submit]');
    const error = loginForm.find('#error-message');
    const info = loginForm.find('#success-message');
    let canShowPsw = false;

    getDB(state => {
        if (state.userdata !== undefined && state.userdata.confirm_email) redirect('./index.html');
        else if (!state.userdata.confirm_email) redirect('./confirm-email.html');
    });

    showPsw.click(function () {
        canShowPsw = !canShowPsw;
        pswField.attr({ type: canShowPsw ? 'text' : 'password' });
        showPsw.find('span').text(canShowPsw ? 'visibility_off' : 'visibility');
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

        const spinner = loginForm.find('.spinner-outer').spinner();

        if (!isValidEmail(emailField.val())) {
            spinner.find('.e-spinner').remove();
            emailField.removeClass('shake').addClass('shake');
            error.show().css('animation: slideInDown 0.3s ease').text('Please enter a valid email address.');
            return;
        }

        if (!pswField.val().length > 8) {
            spinner.find('.e-spinner').remove();
            pswField.removeClass('shake').addClass('shake');
            error.show().css('animation: slideInDown 0.3s ease').text('Please enter a valid password.');
            return;
        }

        
        EQuery(this).css('cursor: not-allowed').attr({disbled: true});

        const requestJSON = {
            "email": emailField.val(),
            "psw": pswField.val()
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

        const response = await fetchWithTimeout(`/login/ppsecure`, requestOptions);
        spinner.find('.e-spinner').remove();

        if (response.detail === undefined) {
            let state = getState();
            state.userdata = response;
            setState(state, function () {
                info.show().css('animation: slideInDown 0.3s ease').text('Login successful!');
                error.hide().text('');
                if (!state.userdata.confirm_email) redirect('./confirm-email.html');
                else redirect('./');
            });
        } else {
            error.show().css('animation: slideInDown 0.3s ease').text(response.detail.error || "An error occured while processing your request");
        }
        spinner.find('.e-spinner').remove();
        EQuery(this).css('cursor: default').attr({disbled: false});
    });

    EQuery('.forgot-password').click(() => redirect('./forget-password.html'));
    EQuery('#toSignup').click(() => redirect('./signup.html'));
});