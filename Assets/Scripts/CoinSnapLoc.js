#pragma strict
import System.IO;

var Language: int = 1; // 1 = en-us, 2 = de-de
var Localize: TextAsset;
private var arLocLines: String[];
private var CoinSnapLogic: GameObject;

function Awake()
{
	try 
	{
		Localize = Resources.Load("Locfile", TextAsset);
        arLocLines = Localize.text.Split('\n'[0]);
    }
    catch (e) 
    {
        // Let the user know what went wrong.
    }
}

function getLoc(text:String): String
{
	var retval:String = "";
	if (text != "")
	{
		retval = locFind(text);
	}
	else
	{
		retval = "no loc";
	}
	return retval;
}

function setLang(lang:int)
{
	if (lang > 0)
	{
		Language = lang;
	}
}

function locFind(text:String): String
{
	var retval:String = "";
	var strLine:String = "";
	
	for (var i:int = 0; i < arLocLines.Length; i++)
	{
		strLine = arLocLines[i].Trim();
		if (strLine.IndexOf('++') < 0) // don't starts with '++'
		{
			var strTriple: String[] = strLine.Split('|'[0]);
			if (text == strTriple[0])
			{
				retval = strTriple[Language];
				break;
			}
			else
			{
				retval = "no loc";
			}
		}
	} 	
	
	return retval;	
}