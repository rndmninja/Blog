#!/bin/bash

# Check if the script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script as root or with sudo."
  exit 1
fi
# Get the system's IP address
ip_address="localhost"

# Create the XML content
xml_content="<?xml version=\"1.1\" encoding=\"UTF-8\"?>
<jenkins.model.JenkinsLocationConfiguration>
  <jenkinsUrl>http://$ip_address:8080/</jenkinsUrl>
</jenkins.model.JenkinsLocationConfiguration>"

# Write the XML content to a file
echo "$xml_content" > /var/lib/jenkins/jenkins.model.JenkinsLocationConfiguration.xml
chown jenkins:jenkins /var/lib/jenkins/jenkins.model.JenkinsLocationConfiguration.xml

echo "IP address has been written to Jenkins"
service jenkins restart
echo "Jenkins restarted"
echo "Connect to Jenkins at http://$ip_address:8080/ or with suitable port forwards if behind NAT"
