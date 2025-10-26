import '/equery.js';
import {
    getState,
    getDB,
    setState,
    redirect
} from '/util.js';

EQuery(function () {
    let verifyForm = EQuery('#verifyCard');
    let codeField = verifyForm.find('#codeInput');
    let resendCountdown = verifyForm.find('#resendCountdown');
    let resendEmail = verifyForm.find('#resendEmail');
    let submitBtn = verifyForm.find('button[type=submit]');
    let prompt = verifyForm.find('.input-prompt');

    getDB(state => {
        if (state.userdata == undefined) redirect('/login.html');
        if (state.userdata !== undefined && state.userdata.confirm_email) redirect('/index.html');
    });

    startCountdown();

    async function send_email() {
        let spinner = verifyForm.find('.spinner-outer').spinner();
        submitBtn.attr({ disabled: 0 });

        prompt.hide()
            .removeClass('error')
            .removeClass('info')
            .text('');

        let requestJSON = {
            "user_id": getState().userdata.id
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
        let response = await (await fetch(`https://surfnetwork-api.onrender.com/register/request_confirm_email?user_id=${getState().userdata.id}`, requestOptions)).json().catch(e => {
            prompt.show()
                .addClass('error')
                .text('An error occured while processing your request');
            spinner.remove();
            submitBtn.removeAttr('disabled');
            throw new Error(e)
        });

        spinner.find('e-spinner').remove();
        submitBtn.removeAttr('disabled');

        prompt.show()
            .addClass('info')
            .text('Email has been sent');

        startCountdown();
    }

    function startCountdown() {
        let countdown = 3;

        resendCountdown.show();
        resendEmail.hide();

        let interval = setInterval(function () {
            resendCountdown.text('Resend in ' + countdown + 's');
            if (countdown <= 0) {
                resendCountdown.hide();
                resendEmail.show();
                clearInterval(interval);
                countdown = 30;
            }
            countdown--;
        }, 1000);
    }

    resendEmail.click(send_email);

    submitBtn.click(async function (e) {
        e.preventDefault();

        prompt.hide()
            .removeClass('error')
            .removeClass('info')
            .text('');

        if (codeField.val() !== '') {
            let spinner = verifyForm.find('.spinner-outer').spinner();
            let _this = this;
            this.disabled = true;

            let requestJSON = {
                "user_id": getState().userdata.id,
                "email_code": codeField.val()
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
            let response = await (await fetch(`https://surfnetwork-api.onrender.com/register/confirm_email?user_id=${getState().userdata.id}&email_code=${codeField.val()}`, requestOptions)).json().catch(e => {
                spinner.find('.e-spinner').remove();
                _this.disabled = false;
                throw new Error(e)
            });

            spinner.find('.e-spinner').remove();
            this.disabled = false;

            if (response.error === undefined && response.detail === undefined && response.status == 'success') {
                let state = getState();
                state.userdata = response.userdata;
                setState(state, function () {
                    prompt.hide()
                        .removeClass('error')
                        .text('');
                    redirect('/index.html');
                });
            } else {
                prompt.show()
                    .addClass('error')
                    .text(response.error);
            }

        } else {
            codeField.addClass('shake');
            setTimeout(() => codeField.removeClass('shake'), 300);
        }
    });
});