AC_PREREQ(2.63)
AC_INIT([mine-gnome-shell-extensions],[0.1],[bardelli.marco@gmail.com])

test -d build-aux || mkdir build-aux
AC_CONFIG_MACRO_DIR([build-aux])
AC_CONFIG_AUX_DIR([build-aux])

AM_INIT_AUTOMAKE([1.10 dist-xz no-dist-gzip foreign tar-ustar])
AM_MAINTAINER_MODE([enable])

m4_ifdef([AM_SILENT_RULES],[AM_SILENT_RULES([yes])])

dnl GETTEXT_PACKAGE=gnome-shell-extensions
dnl AC_SUBST(GETTEXT_PACKAGE)
dnl AC_DEFINE_UNQUOTED(GETTEXT_PACKAGE, "$GETTEXT_PACKAGE",
dnl                    [The prefix for our gettext translation domains.])
dnl IT_PROG_INTLTOOL(0.26)

PKG_PROG_PKG_CONFIG([0.22])

GLIB_GSETTINGS

SHELL_VERSION="`gnome-shell --version | cut -d' ' -f3`"
shell_major=`echo "$PACKAGE_VERSION" | cut -d'.' -f1`
shell_minor=`echo "$PACKAGE_VERSION" | cut -d'.' -f2`
if test "$(($shell_minor % 2))" -eq 0; then
	SHELL_VERSION="$shell_major.$shell_minor"
fi
AC_SUBST([SHELL_VERSION])

dnl keep this in alphabetic order
dnl CLASSIC_EXTENSIONS="apps-menu places-menu alternate-tab launch-new-instance window-list"
DEFAULT_EXTENSIONS="$CLASSIC_EXTENSIONS alternative-status-menu drive-menu windowsNavigator workspace-indicator"
dnl ALL_EXTENSIONS="$DEFAULT_EXTENSIONS auto-move-windows example native-window-placement systemMonitor user-theme xrandr-indicator"

ALL_EXTENSIONS="upower"

dnl AC_SUBST(CLASSIC_EXTENSIONS, [$CLASSIC_EXTENSIONS])
AC_SUBST(ALL_EXTENSIONS, [$ALL_EXTENSIONS])
AC_ARG_ENABLE([extensions],
	[AS_HELP_STRING([--enable-extensions],[Space separated list of extensions to enable.
	The default is to build and distribute all extensions that can be installed in the home directory and have no external depedencies.
	Use "all" to enable all available extensions, or "classic-mode" to enable extensions that restore GNOME 2 functionality.])],
	[],
	[enable_extensions=$ALL_EXTENSIONS]
)

dnl if test x"$enable_extensions" = xall; then
dnl    enable_extensions="$ALL_EXTENSIONS"
dnl    enable_classic_mode_default=yes
dnl elif test x"$enable_extensions" = xclassic-mode; then
dnl    enable_extensions="$CLASSIC_EXTENSIONS"
dnl    enable_classic_mode_default=yes
dnl else
dnl    enable_classic_mode_default=no
dnl fi

dnl AC_ARG_ENABLE([classic-mode],
dnl         [AS_HELP_STRING([--enable-classic-mode],[Enable installing data files for classic mode.
dnl         Defaults to yes if enabling all or classic-mode extensions, and no otherwise.])],
dnl         [],
dnl         [enable_classic_mode=$enable_classic_mode_default])
dnl AM_CONDITIONAL([CLASSIC_MODE], [test x"$enable_classic_mode" != xno])

dnl ENABLED_EXTENSIONS=
dnl for e in $enable_extensions; do
dnl 	case $e in
dnl 		systemMonitor)
dnl 			PKG_CHECK_MODULES(GTOP, libgtop-2.0 >= 2.28.3,
dnl 					[ENABLED_EXTENSIONS="$ENABLED_EXTENSIONS $e"],
dnl 					[AC_MSG_WARN([libgtop-2.0 not found, disabling systemMonitor])])
dnl 			;;
dnl 		xrandr-indicator)
dnl 			PKG_CHECK_MODULES(GNOME_DESKTOP, gnome-desktop-3.0 >= 2.91.6,
dnl 					[ENABLED_EXTENSIONS="$ENABLED_EXTENSIONS $e"],
dnl 					[AC_MSG_WARN([gnome-desktop-3.0 not found, disabling xrandr-indicator])])
dnl 			;;
dnl dnl		keep this in alphabetic order
dnl 		alternate-tab|alternative-status-menu|apps-menu|auto-move-windows|drive-menu|example|launch-new-instance|native-window-placement|places-menu|user-theme|window-list|windowsNavigator|workspace-indicator)
dnl 			ENABLED_EXTENSIONS="$ENABLED_EXTENSIONS $e"
dnl 			;;
dnl 		*)
dnl 			AC_MSG_ERROR([invalid extension $e])
dnl 	esac
dnl done

dnl AC_SUBST(ENABLED_EXTENSIONS, [$ENABLED_EXTENSIONS])
AC_SUBST(ENABLED_EXTENSIONS, [$ALL_EXTENSIONS])

dnl Please keep this sorted alphabetically
AC_CONFIG_FILES([
  simple-test/Makefile
  upower/Makefile
  Makefile
])
AC_OUTPUT
