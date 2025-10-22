import './equery.js';
import { getState, getDB, setState, redirect } from './util.js';

EQuery(function () {
    let signupForm = EQuery('#signupCard');
    let usernameField = signupForm.find('#usernameInput');
    let emailField = signupForm.find('#emailInput');
    let pswField = signupForm.find('#pswInput');
    let cpswField = signupForm.find('#cpswInput');
    let showPsw = signupForm.find('.togglePsw');
    let termsCheckbox = signupForm.find('#termsCheckbox');
    let subCheckbox = signupForm.find('#subCheckbox');
    let submitBtn = signupForm.find('button[type=submit]');
    let pswValidateBox = signupForm.find('#pswValidateBox');
    let prompt = signupForm.find('.input-prompt');
    let validpsw = false;
    let equalpsw = false;
    let canShowPsw = false;

    pswField.attr({ type: canShowPsw ? 'text' : 'password' });
    cpswField.attr({ type: canShowPsw ? 'text' : 'password' });

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

    signupForm.find('#toLogin').clock

    showPsw.click(function () {
        canShowPsw = !canShowPsw;

        pswField.attr({ type: canShowPsw ? 'text' : 'password' });
        cpswField.attr({ type: canShowPsw ? 'text' : 'password' });
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
    console.log(pswField, pswValidateBox)

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

        prompt.hide()
            .removeClass('error')
            .text('');

        if (!termsCheckbox.val()) {
            termsCheckbox.removeClass('shake');
            termsCheckbox.addClass('shake');
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
                    prompt.hide()
                        .removeClass('error')
                        .text('');
                    redirect('./confirm-email.html');
                });
            } else {
                prompt.show()
                    .addClass('error')
                    .text(response.error);
            }

        } else {
            pswValidateBox.removeClass('shake');
            pswValidateBox.addClass('shake');
        }
    });

    signupForm.find('#toLogin').click(() => redirect('./login.html'));
});