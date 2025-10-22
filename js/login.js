import {
    getState,
    getDB,
    setState,
    redirect
} from './util.js';
import './script.js';

EQuery(function () {
    let loginForm = EQuery('#login-form');
    let emailField = loginForm.find('#email');
    let pswField = loginForm.find('#password');
    let showPsw = loginForm.find('.togglePsw');
    let submitBtn = loginForm.find('button[type=submit]');
    let error = loginForm.find('.error-message');
    let info = loginForm.find('.success-message');
    let canShowPsw = false;

    getDB(state => {
        if (state.userdata !== undefined && state.userdata.confirm_email) redirect('./index.html');
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

        let spinner = loginForm.find('.spinner-outer').spinner();

        if (!isValidEmail(emailField.val())) {
            spinner.find('.e-spinner').remove();
            emailField.removeClass('shake').addClass('shake');
            error.show().css('animation: slideInDown 0.3s ease').text('Please enter a valid email address.');
            return;
        }

        let requestJSON = {
            "email": emailField.val(),
            "psw": pswField.val()
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let raw = JSON.stringify(requestJSON);
        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };
        let response = await (await fetch('https://surfnetwork-api.onrender.com/login/ppsecure', requestOptions)).json().catch(e => {
            throw new Error(e)
        });

        spinner.find('.e-spinner').remove();
        console.log(response)

        if (response.detail === undefined) {
            let state = getState();
            state.userdata = response;
            setState(state, function () {
                info.show().css('animation: slideInDown 0.3s ease').text('Login successful!');
                error.hide().text('');
                if (!state.userdata.confirm_email) redirect('./confirm-email.html');
                else redirect('./index.html');
            });
        } else {
            error.show().css('animation: slideInDown 0.3s ease').text(response.detail.error || "An error occured while processing your request");
        }
    });

    loginForm.find('#toSignup').click(() => redirect('./signup.html'));
});