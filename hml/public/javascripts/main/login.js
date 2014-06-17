$(function () {
	var $localEmail = localStorage.email;
	var $localPassword = localStorage.password;
	var $localRemember = localStorage.remember;

	$('[role=form]').on({
		submit: function (e) {
			e.preventDefault();

			$('[data-access="email"]').removeClass('alert alert-danger');
			$('[data-access="password"]').removeClass('alert alert-danger');

			var $email = $('[data-access="email"]').val() == "" ? $localEmail : $('[data-access="email"]').val();
			var $password = CryptoJS.MD5($('[data-access="password"]').val()).toString(CryptoJS.enc.Hex) == CryptoJS.MD5($("").val()).toString(CryptoJS.enc.Hex) ? $localPassword : CryptoJS.MD5($('[data-access="password"]').val()).toString(CryptoJS.enc.Hex);
			var $remember = $('[data-access="remember"]').is(':checked');

			var data = {
				email: $email,
				password: $password
			};

			if ($remember) {
				localStorage['email'] = $email;
				localStorage['password'] = $password;
				localStorage['remember'] = $remember;
			} else {
				delete localStorage.email;
				delete localStorage.password;
				localStorage['remember'] = false;
			}

			$.post('/login', data, function (d) {
				d = TypeData(d);
				switch (d.constructor.name) {
				case "HMLError":
					console.error(d.ErrorCode, d.Message);
					switch (d.ErrorCode) {
					case EHMLError.INVALID_USER:
						$('[data-access="email"]').addClass('alert alert-danger');
						break;
					case EHMLError.INVALID_PASS:
						$('[data-access="password"]').addClass('alert alert-danger');
						break;
					}
					break;
				case "HMLRedirect":
					console.info('Redirecting: ' + d.Redirect);
					window.location = d.Redirect;
					break;
				}
			});
		}
	});

	if ($localEmail && $localPassword && $localRemember) {
		$('[data-access="remember"]').prop('checked', $localRemember);
		$('[role=form]').submit();
	}
});
