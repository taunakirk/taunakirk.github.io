function initHeaderWidget() {
    document.fonts.ready.then(function() {
        document.body.classList.remove('fonts-loading');
        document.body.classList.add('fonts-loaded');
    });
    setTimeout(function() {
        document.body.classList.remove('fonts-loading');
        document.body.classList.add('fonts-loaded');
    }, 3000);

    var dayEl = document.getElementById('widget-day');
    var timeEl = document.getElementById('widget-time');
    var tempEl = document.getElementById('widget-temp');

    function updateTime() {
        var now = new Date();
        dayEl.textContent = now.toLocaleDateString(undefined, { weekday: 'long' });
        timeEl.textContent = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit' });
    }

    function fetchWeather() {
        function tryWithCoords(lat, lon) {
            fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m&timezone=auto')
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    var temp = data.current && data.current.temperature_2m;
                    tempEl.textContent = temp != null ? Math.round(temp) + '\u00B0C' : '--';
                })
                .catch(function() { tempEl.textContent = '--'; });
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(pos) { tryWithCoords(pos.coords.latitude, pos.coords.longitude); },
                function() {
                    fetch('https://ipapi.co/json/')
                        .then(function(r) { return r.json(); })
                        .then(function(data) {
                            if (data.latitude && data.longitude) {
                                tryWithCoords(data.latitude, data.longitude);
                            } else {
                                tempEl.textContent = '--';
                            }
                        })
                        .catch(function() { tempEl.textContent = '--'; });
                }
            );
        } else {
            fetch('https://ipapi.co/json/')
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    if (data.latitude && data.longitude) {
                        tryWithCoords(data.latitude, data.longitude);
                    } else {
                        tempEl.textContent = '--';
                    }
                })
                .catch(function() { tempEl.textContent = '--'; });
        }
    }

    updateTime();
    setInterval(updateTime, 1000);
    tempEl.textContent = '...';
    fetchWeather();
}

initHeaderWidget();

function initClassRibbons() {
    var list = document.querySelector('.classes-ribbons');
    if (!list) return;

    var tabs = list.querySelectorAll('.class-ribbon-tab');
    tabs.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var expanded = btn.getAttribute('aria-expanded') === 'true';
            var detailsId = btn.getAttribute('aria-controls');
            var details = detailsId ? document.getElementById(detailsId) : null;

            if (details) {
                if (expanded) {
                    btn.setAttribute('aria-expanded', 'false');
                    details.hidden = true;
                } else {
                    btn.setAttribute('aria-expanded', 'true');
                    details.hidden = false;
                }
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClassRibbons);
} else {
    initClassRibbons();
}
