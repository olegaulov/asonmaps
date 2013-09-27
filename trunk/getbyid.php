<?php
$id = $_POST["id"];
echo $id;
$mask = "*.jpg"
array_map("unlink", glob($mask));

$ses = ssh2_connect("intel03");
echo $ses;
if($ses)
{
	if(ssh2_auth_pubkey_file($ses , "adprice1", "/home/adprice1/.ssh/id_rsa.pub", "/home/adprice1/.ssh/id_rsa"))
	{
		if(ssh2_scp_recv($ses, "/bluegrit/nfs3/oleg2/instagram/hurricanesandy/$id.jpg", "$id.jpg"))
		{
			echo "get it";
		}
		else 
		{
			echo "lost it";	
		}
	}
	else 
	{
		echo "no session";	
	}
}
else 
{
	echo "no host";	
}
?>

