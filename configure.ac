AC_PREREQ(2.63)
AC_INIT([mine-gnome-shell-extensions],[0.9],[bardelli.marco@gmail.com])

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

ALL_EXTENSIONS="upower"

AC_SUBST(ALL_EXTENSIONS, [$ALL_EXTENSIONS])
dnl AC_ARG_ENABLE([extensions],
dnl 	[AS_HELP_STRING([--enable-extensions],[Space separated list of extensions to enable.
dnl 	The default is to build and distribute all extensions that can be installed in the home directory and have no external depedencies.
dnl 	Use "all" to enable all available extensions, or "classic-mode" to enable extensions that restore GNOME 2 functionality.])],
dnl 	[],
dnl 	[enable_extensions=$ALL_EXTENSIONS]
dnl )
AC_SUBST(ENABLED_EXTENSIONS, [$ALL_EXTENSIONS])

AC_CONFIG_FILES([
  simple-test/Makefile
  upower/Makefile
  Makefile
])
AC_OUTPUT
