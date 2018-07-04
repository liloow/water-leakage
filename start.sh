#!/bin/bash

JSON=$(cat ./index.js | node -p )
echo "$JSON" >res.json


# Crude address database

# clear # Clear the screen.

# echo "          Contact List"
# echo "          ------- ----"
# echo "Choose one of the following persons:"
# echo
# echo "[E]vans, Roland"
# echo "[J]ones, Mildred"
# echo "[S]mith, Julie"
# echo "[Z]ane, Morris"
# echo

# read person

# case "$person" in
# # Note variable is quoted.

#   "E" | "e" )
#   # Accept upper or lowercase input.
#   echo
#   echo "Roland Evans"
#   echo "4321 Flash Dr."
#   echo "Hardscrabble, CO 80753"
#   echo "(303) 734-9874"
#   echo "(303) 734-9892 fax"
#   echo "revans@zzy.net"
#   echo "Business partner & old friend"
#   ;;
# # Note double semicolon to terminate each option.

#   "J" | "j" )
#   echo
#   echo "Mildred Jones"
#   echo "249 E. 7th St., Apt. 19"
#   echo "New York, NY 10009"
#   echo "(212) 533-2814"
#   echo "(212) 533-9972 fax"
#   echo "milliej@loisaida.com"
#   echo "Ex-girlfriend"
#   echo "Birthday: Feb. 11"
#   ;;

# # Add info for Smith & Zane later.

#           * )
#    # Default option.
#    # Empty input (hitting RETURN) fits here, too.
#    echo
#    echo "Not yet in database."
#   ;;

# esac

# echo
function BatteryOP5
{
while true; do
echo -e "\e[01;91m   UP  Less Battery / More Performance \e[00;37m"
echo -e "\e[01;33m   | \e[00;37m"
echo -e "\e[01;93m   | \e[00;37m"
echo -e "\e[01;92m DOWN  More Battery / Less Performance \e[00;37m"
echo ""
sleep 1.5
echo -e "\e[02;91m 1.) Project Zhana Battery by @Asiier \e[00;37m"
echo -e "\e[01;31m 2.) Nameless Battery by @Senthil360  \e[00;37m"
echo -e "\e[02;33m 3.) FairPark by @Asiier \e[00;37m"
echo -e "\e[01;93m 4.) Fusion Conservative by @patalao \e[00;37m"
echo -e "\e[01;93m 5.) Project X.A.N.A Battery by @Asiier \e[00;37m"
echo -e "\e[01;92m 6.) Project X.A.N.A Battery Extreme by @Asiier \e[00;37m"
echo -e "\e[01;90m 7.) Soilwork_battery by @rogerf81 \e[00;37m"
echo -e "\e[01;90m 8.) Soilwork_battery_extreme by @rogerf81 \e[00;37m"
echo -e "\e[01;94m 9.) Main menu \e[00;37m"
echo ""
echo $divider
echo ""
echo -n "Please select a profile:"
read option
echo ""
case $option in
1 ) #Project_Zhana_Battery
$BB mount -o remount,rw /system 2>/dev/null
mount -o remount,rw /system 2>/dev/null
if [ -e "/system/su.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/PZ_battery > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/su.d/99AKT
chmod 700 /system/su.d/99AKT
fi
if [ -e "/system/etc/init.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/PZ_battery > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/su.d/99AKT
chmod 777 /system/etc/init.d/99AKT
fi
if [ -e "/storage/emulated/0/AKT/AKT" ]; then
grep -v "sleep" /system/etc/AKT/PZ_battery > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /storage/emulated/0/AKT/AKT
fi
chmod 777 /system/etc/AKT/PZ_battery
clear
sh /system/etc/AKT/PZ_battery
clear
echo " Installation finished... "
echo " For additional information and questions, please visit our XDA thread"
sleep 10
sleep 5; main_menu_op5;
exit;;
2 ) #Nameless_Battery
$BB mount -o remount,rw /system 2>/dev/null
mount -o remount,rw /system 2>/dev/null
if [ -e "/system/su.d/99AKT" ]; then
grep -v "sleep" ./system/etc/AKT/NLB_battery > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/su.d/99AKT
chmod 700 /system/su.d/99AKT
fi
if [ -e "/system/etc/init.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/NLB_battery > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/etc/init.d/99AKT
chmod 777 /system/etc/init.d/99AKT
fi
chmod 777 /system/etc/AKT/NLB_battery
clear
if [ -e "/storage/emulated/0/AKT/AKT" ]; then
grep -v "sleep" /system/etc/AKT/NLB_battery > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /storage/emulated/0/AKT/AKT
fi
sh /system/etc/AKT/NLB_battery
clear
echo " Installation finished... "
echo " For additional information and questions, please visit our XDA thread"
sleep 5; main_menu_op5;
exit;;
3 ) #FairPark
$BB mount -o remount,rw /system 2>/dev/null
mount -o remount,rw /system 2>/dev/null
if [ -e "/system/su.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/FairPark > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/su.d/99AKT
chmod 700 /system/su.d/99AKT
fi
if [ -e "/system/etc/init.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/FairPark > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/etc/init.d/99AKT
chmod 777 /system/etc/init.d/99AKT
fi
if [ -e "/storage/emulated/0/AKT/AKT" ]; then
grep -v "sleep" /system/etc/AKT/FairPark > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /storage/emulated/0/AKT/AKT
fi
chmod 777 /system/etc/AKT/FairPark
clear
sh /system/etc/AKT/FairPark
clear
echo " Installation finished... "
echo " For additional information and questions, please visit our XDA thread"
sleep 5; main_menu_op5;
exit;;
4 ) #Fusion Conservative
$BB mount -o remount,rw /system 2>/dev/null
mount -o remount,rw /system 2>/dev/null
if [ -e "/system/su.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/FusionC > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/su.d/99AKT
chmod 700 /system/su.d/99AKT
fi
if [ -e "/system/etc/init.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/FusionC > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/etc/init.d/99AKT
chmod 777 /system/etc/init.d/99AKT
fi
if [ -e "/storage/emulated/0/AKT/AKT" ]; then
grep -v "sleep" /system/etc/AKT/FusionP > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /storage/emulated/0/AKT/AKT
fi
chmod 777 /system/etc/AKT/FusionP
clear
sh /system/etc/AKT/FusionC
clear
echo " Installation finished... "
echo " For additional information and questions, please visit our XDA thread"
sleep 5; main_menu_op5;
exit;;
5 ) #Project_XANA_Battery
$BB mount -o remount,rw /system 2>/dev/null
mount -o remount,rw /system 2>/dev/null
if [ -e "/system/su.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/PX_battery > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/su.d/99AKT
chmod 700 /system/su.d/99AKT
fi
if [ -e "/system/etc/init.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/PX_battery > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/etc/init.d/99AKT
chmod 777 /system/etc/init.d/99AKT
fi
if [ -e "/storage/emulated/0/AKT/AKT" ]; then
grep -v "sleep" /system/etc/AKT/PX_battery > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /storage/emulated/0/AKT/AKT
fi
chmod 777 /system/etc/AKT/PX_battery
clear
sh /system/etc/AKT/PX_battery
clear
echo " Installation finished... "
echo " For additional information and questions, please visit our XDA thread"
sleep 5; main_menu_op5;
exit;;
6 ) #Project_XANA_Extreme
$BB mount -o remount,rw /system 2>/dev/null
mount -o remount,rw /system 2>/dev/null
if [ -e "/system/su.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/PX_battery_extreme > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/su.d/99AKT
chmod 700 /system/su.d/99AKT
fi
if [ -e "/system/etc/init.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/PX_battery_extreme > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/etc/init.d/99AKT
chmod 777 /system/etc/init.d/99AKT
fi
if [ -e "/storage/emulated/0/AKT/AKT" ]; then
grep -v "sleep" /system/etc/AKT/PX_battery_extreme > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /storage/emulated/0/AKT/AKT
fi
chmod 777 /system/etc/AKT/PX_battery_extreme
clear
sh /system/etc/AKT/PX_battery_extreme
clear
echo " Installation finished... "
echo " For additional information and questions, please visit our XDA thread"
sleep 5; main_menu_op5;
exit;;
7 ) #Soilwork_battery
$BB mount -o remount,rw /system 2>/dev/null
mount -o remount,rw /system 2>/dev/null
if [ -e "/system/su.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/Soilwork_battery > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/su.d/99AKT
chmod 700 /system/su.d/99AKT
fi
if [ -e "/system/etc/init.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/Soilwork_battery > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/su.d/99AKT
chmod 777 /system/etc/init.d/99AKT
fi
if [ -e "/storage/emulated/0/AKT/AKT" ]; then
grep -v "sleep" /system/etc/AKT/Soilwork_battery > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /storage/emulated/0/AKT/AKT
fi
chmod 777 /system/etc/AKT/Soilwork_battery
clear
sh /system/etc/AKT/Soilwork_battery
clear
echo " Installation finished... "
echo " For additional information and questions, please visit our XDA thread"
sleep 10
sleep 5; main_menu_op5;
exit;;
8 ) #Soilwork_battery_extreme
$BB mount -o remount,rw /system 2>/dev/null
mount -o remount,rw /system 2>/dev/null
if [ -e "/system/su.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/Soilwork_battery_extreme > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/su.d/99AKT
chmod 700 /system/su.d/99AKT
fi
if [ -e "/system/etc/init.d/99AKT" ]; then
grep -v "sleep" /system/etc/AKT/Soilwork_battery_extreme > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /system/su.d/99AKT
chmod 777 /system/etc/init.d/99AKT
fi
if [ -e "/storage/emulated/0/AKT/AKT" ]; then
grep -v "sleep" /system/etc/AKT/Soilwork_battery_extreme > /system/etc/AKT/Temp && mv /system/etc/AKT/Temp /storage/emulated/0/AKT/AKT
fi
chmod 777 /system/etc/AKT/Soilwork_battery_extreme
clear
sh /system/etc/AKT/Soilwork_battery_extreme
clear
echo " Installation finished... "
echo " For additional information and questions, please visit our XDA thread"
sleep 10
sleep 5; main_menu_op5;
exit;;
9 ) clear; main_menu_op5;;
* ) clear; echo " Please, enter a valid option...";
sleep 2;
clear;;
esac
# }
 done
}
