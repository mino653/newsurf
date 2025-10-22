import './equery.js';
import { getState, getDB, setState, redirect } from './util.js';

EQuery(function () {
    let signupForm = EQuery('#signup-form');
    let usernameField = signupForm.find('#username');
    let emailField = signupForm.find('#email');
    let pswField = signupForm.find('#password');
    let cpswField = signupForm.find('#confirmPassword');
    let showPsw = signupForm.find('.password-toggle-btn');
    let termsCheckbox = signupForm.find('#terms');
    let subCheckbox = signupForm.find('#newsletter');
    let submitBtn = signupForm.find('button[type=submit]');
    let pswValidateBox = signupForm.find('#pswValidateBox');
    let error = signupForm.find('.error-message');
    let info = signupForm.find('.success-message');
    let validpsw = false;
    let equalpsw = false;
    let canShowPsw = false;

    pswField.attr({ type: canShowPsw ? 'text' : 'password' });
    cpswField.attr({ type: canShowPsw ? 'text' : 'password' });
    showPsw.find('span').text(canShowPsw ? 'visibility_off' : 'visibility');

    getDB(state => {
        if (state.userdata !== undefined) redirect('./index.html');
    });

    function validPsw(input) {
        let l, u, n, c;
        let lowerCaseLetters = /[a-z]/g;
        let upperCaseLetters = /[A-Z]/g;
        let numbers = /[0-9]/g;

        let letter = pswValidateBox.find('#letter');
        let capital = pswValidateBox.find('#capital');
        let number = pswValidateBox.find('#number');
        let length = pswValidateBox.find('#length');

        input.keyup(function () {
            if (input.val().match(lowerCaseLetters)) {
                letter.removeClass('invalid');
                letter.addClass('valid');
                l = true;
            } else {
                letter.removeClass('valid');
                letter.addClass('invalid');
                l = false;
            }

            if (input.val().match(upperCaseLetters)) {
                capital.removeClass('invalid');
                capital.addClass('valid');
                u = true;
            } else {
                capital.removeClass('valid');
                capital.addClass('invalid');
                u = false;
            }

            if (input.val().match(numbers)) {
                number.removeClass('invalid');
                number.addClass('valid');
                n = true;
            } else {
                number.removeClass('valid');
                number.addClass('invalid');
                n = false;
            }

            if (input.val().length >= 8) {
                length.removeClass('invalid');
                length.addClass('valid');
                c = true;
            } else {
                length.removeClass('valid');
                length.addClass('invalid');
                c = false;
            }
            if (l && u && n && c)
                validpsw = true;
            else {
                validpsw = false;
            }
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showPsw.click(function () {
        canShowPsw = !canShowPsw;

        pswField.attr({ type: canShowPsw ? 'text' : 'password' });
        cpswField.attr({ type: canShowPsw ? 'text' : 'password' });
        showPsw.find('span').text(canShowPsw ? 'visibility_off' : 'visibility');
    });

    validPsw(pswField);

    cpswField.keyup(function () {
        equalpsw = cpswField.val() == pswField.val();

        if (cpswField.val() == pswField.val()) {
            pswValidateBox.find('#equal').removeClass('invalid');
            pswValidateBox.find('#equal').addClass('valid');
        } else {
            pswValidateBox.find('#equal').removeClass('valid');
            pswValidateBox.find('#equal').addClass('invalid');
        }
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

    pswField.focus(function () {
        pswValidateBox.show();
    });

    pswField.blur(function () {
        pswValidateBox.hide();
    });

    cpswField.focus(function () {
        pswValidateBox.show();
    });

    cpswField.blur(function () {
        pswValidateBox.hide();
    });

    submitBtn.click(async function (e) {
        e.preventDefault();

        error.hide().text('');
        info.hide().text('');

        if (!termsCheckbox.val()) {
            termsCheckbox.removeClass('shake');
            termsCheckbox.addClass('shake');
            return;
        }

        if (!isValidEmail(emailField.val())) {
            emailField.removeClass('shake').addClass('shake');
            error.show().css('animation: slideInDown 0.3s ease').text('Please enter a valid email address.');
            return;
        }

        if (validpsw && equalpsw) {
            let spinner = signupForm.find('.spinner-outer').spinner();
            this.disabled = true;

            let requestJSON = {
                "username": usernameField.val(),
                "email": emailField.val(),
                "psw": pswField.val(),
                "sub": subCheckbox.val()
            };

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let raw = JSON.stringify(requestJSON);
            let requestOptions = { method: 'POST', headers: headers, body: raw, redirect: 'follow' };
            let response = await (await fetch('https://surfnetwork-api.onrender.com/register/ppsecure', requestOptions)).json().catch(e => { throw new Error(e) });

            spinner.find('.e-spinner').remove();
            this.disabled = false;

            if (response.error === undefined) {
                let state = getState();
                state.userdata = response;
                setState(state, function () {
                    error.hide().text('');
                    info.show().css('animation: slideInDown 0.3s ease').text('Registration successful! Redirecting...');
                    redirect('./confirm-email.html');
                });
            } else {
                error.show().css('animation: slideInDown 0.3s ease').text(response.error);
            }

        } else {
            pswValidateBox.removeClass('shake');
            pswValidateBox.addClass('shake');
        }
    });

    signupForm.find('#toLogin').click(() => redirect('./login.html'));
});