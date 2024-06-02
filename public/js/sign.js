window.onoffline = () => {
    document.querySelectorAll('input')
    .forEach(e => {
        e.setAttribute('disabled', "true");
    });
};
window.ononline = () => {
    document.querySelectorAll('input')
    .forEach(e => {
        e.removeAttribute('disabled');
    });
};