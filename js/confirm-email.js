import {
    getState,
    getDB,
    setState,
    redirect,
    fetchWithTimeout,
    showMessage
} from './util.js';
import './script.js'

EQuery(function () {
    const verifyForm = EQuery('#verify-form');
    const codeField = verifyForm.find('#codeInput');
    const resendCountdown = verifyForm.find('#resendCountdown');
    const resendEmail = verifyForm.find('#resendEmail');
    const submitBtn = verifyForm.find('button[type=submit]');
    const error = verifyForm.find('#error-message');
    const info = verifyForm.find('#success-message');

    getDB(state => {
        if (state.userdata == undefined) redirect('./login.html');
        if (state.userdata !== undefined && state.userdata.confirm_email) redirect('./index.html');
        send_email();
    });

    async function send_email() {
        let spinner = verifyForm.find('.spinner-outer').spinner();
        submitBtn.attr({ disabled: 0 });

        error.hide();
        info.hide();
        try {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            
            const requestOptions = {
                method: 'POST',
                headers: headers,
                redirect: 'follow'
            };
            const response = await fetchWithTimeout(`/register/request_confirm_email?user_id=${getState().userdata.id}`, requestOptions) || {};

            if (response.detail === undefined) {
                submitBtn.removeAttr('disabled');

                info.show().text('Email has been sent');

                startCountdown();   
            } else {
                submitBtn.removeAttr('disabled');
                error.show().text(response.detail.error || "An error occured while processing your request");
            }
        } catch (e) {
            showMessage(`Failed to send email: ${e}.`, 'error');
        }
        spinner.find('.e-spinner').remove();
    }

    function startCountdown() {
        let countdown = 30;

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

        error.hide();
        info.hide();

        if (codeField.val() !== '') {
            let spinner = verifyForm.find('.spinner-outer').spinner();
            let _this = this;
            this.disabled = true;
            try {

                const headers = new Headers();
                headers.append('Content-Type', 'application/json');
                const requestOptions = {
                    method: 'POST',
                    headers: headers,
                    redirect: 'follow'
                };
                const response = await fetchWithTimeout(`/register/confirm_email?user_id=${getState().userdata.id}&email_code=${codeField.val()}`, requestOptions);

                if (response.detail === undefined && response.status == 'success') {
                    let state = getState();
                    state.userdata = response.userdata;
                    setState(state, function () {
                        error.hide();
                        info.hide();
                        redirect('./index.html');
                    });
                } else {
                    info.hide();
                    error.show().text(response.detail.error);
                }
            } catch (e) {
                showMessage(`Failed verify code: ${e}.`, 'error');
            }
            
            spinner.find('.e-spinner').remove();
            this.disabled = false;

        } else {
            codeField.addClass('shake');
            setTimeout(() => codeField.removeClass('shake'), 300);
        }
    });
});