import {
    getState,
    getDB,
    setState,
    redirect
} from './util.js';

EQuery(function () {
    let loginForm = EQuery('#loginCard');
    let emailField = loginForm.find('#emailInput');
    let pswField = loginForm.find('#pswInput');
    let showPsw = loginForm.find('.togglePsw');
    let submitBtn = loginForm.find('button[type=submit]');
    let prompt = loginForm.find('.input-prompt');
    let canShowPsw = false;

    getDB(state => {
        if (state.userdata !== undefined && state.userdata.confirm_email) redirect('./index.html');
    });

    showPsw.click(function () {
        canShowPsw = !canShowPsw;
        pswField.attr({ type: canShowPsw ? 'text' : 'password' });
    });

    submitBtn.click(async function (e) {
        e.preventDefault();

        prompt.hide()
            .removeClass('error')
            .text('');

        let spinner = loginForm.find('.spinner-outer').spinner();
        this.disabled = true;

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
        this.disabled = false; console.log(response)

        if (response.detail === undefined) {
            let state = getState();
            state.userdata = response;
            setState(state, function () {
                prompt.hide()
                    .removeClass('error')
                    .text('');
                if (!state.userdata.confirm_email) redirect('./confirm-email.html');
                else redirect('./index.html');
            });
        } else {
            prompt.show()
                .addClass('error')
                .text(response.detail.error || "An error occured while processing your request");
        }
    });

    loginForm.find('#toRegister').click(() => redirect('./register.html'));
});