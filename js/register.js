import { getState, getDB, setState, redirect, fetchWithTimeout } from '/util.js';
import '/script.js';

EQuery(function () {
    const signupForm = EQuery('#signup-form');
    const usernameField = signupForm.find('#username');
    const emailField = signupForm.find('#email');
    const pswField = signupForm.find('#password');
    const cpswField = signupForm.find('#confirmPassword');
    const showPsw = signupForm.find('.password-toggle-btn');
    const termsCheckbox = signupForm.find('#terms');
    const subCheckbox = signupForm.find('#newsletter');
    const submitBtn = signupForm.find('button[type=submit]');
    const pswValidateBox = signupForm.find('#pswValidateBox');
    const error = signupForm.find('.error-message');
    const info = signupForm.find('.success-message');
    let validpsw = false;
    let equalpsw = false;
    let canShowPsw = false;

    pswField.attr({ type: canShowPsw ? 'text' : 'password' });
    cpswField.attr({ type: canShowPsw ? 'text' : 'password' });
    showPsw.find('span').text(canShowPsw ? 'visibility_off' : 'visibility');

    getDB(state => {
        if (state.userdata !== undefined) redirect('/index.html');
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

    pswField.focus(function (e) {
        EQuery(this).findPosition
        pswValidateBox.show().css(`top: ${EQuery(this).findPosition().top + 55}px`);
    });

    pswField.blur(function () {
        pswValidateBox.hide();
    });

    cpswField.focus(function (e) {
        pswValidateBox.show().css(`top: ${EQuery(this).findPosition().top + 55}px`);
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
            try {
                const spinner = signupForm.find('.spinner-outer').spinner();
                this.disabled = true;

                const requestJSON = {
                    "username": usernameField.val(),
                    "email": emailField.val(),
                    "psw": pswField.val(),
                    "sub": subCheckbox.val()
                };

                const headers = new Headers();
                headers.append('Content-Type', 'application/json');
                const raw = JSON.stringify(requestJSON);
                const requestOptions = { method: 'POST', headers: headers, body: raw, redirect: 'follow' };
                const response = await fetchWithTimeout('https://surfnetwork-api.onrender.com/register/ppsecure', requestOptions);

                spinner.find('.e-spinner').remove();
                this.disabled = false;

                if (response.error === undefined) {
                    const state = getState();
                    state.userdata = response;
                    setState(state, function () {
                        error.hide().text('');
                        info.show().css('animation: slideInDown 0.3s ease').text('Registration successful! Redirecting...');
                        redirect('/confirm-email.html');
                    });
                } else {
                    error.show().css('animation: slideInDown 0.3s ease').text(response.error);
                }
            } catch (e) {
                spinner.find('.e-spinner').remove();
                error.show().css('animation: slideInDown 0.3s ease').text(e);
                EQuery(this).css('cursor: default').attr({disbled: false});
            }
        } else {
            pswValidateBox.removeClass('shake');
            pswValidateBox.addClass('shake');
        }
    });

    EQuery('#toLogin').click(() => redirect('/login.html'));
});