#pragma strict
#pragma downcast

// Game
var Coin:GameObject; // coin prefab to instantiate
var SnapCoin:GameObject; // the active coin
var UICoinName:GameObject; // the prefab of the coin label
var CoinLoca:GameObject; // the prefab of the coin label
var wallMats: Material[];
var Barrel: GameObject; // prefab for barrels;
private var isFree: boolean = true; // free or paid version
private var arCoinLabels = new Array();
private var arCoins = new Array();
private var coinPos:Vector3 = Vector3(0, 1.2, -2.9);
private var newCoinPos:Vector3 = coinPos;
private var oldCoinPos:Vector3 = coinPos;
private var coinActive:boolean = false;
private var camPos: Vector3 = Vector3(0, 1.5, -3.5); 
private var startEuros: int = 10;
private var countHumanPlayer: int = 0;
private var countCompPlayer: int = 0;
private var countPlayer: int;
private var actualPlayer: int = -1;
private var actualRound: int = 0;
private var maxRounds: int = 10;
private var wallPosZ:float = 3.0;
private var coinDoesntMove: int = 0;
private var nextGoOnTime:int = 0;
private var winSplashShown: boolean = false;
private var RoundEndShown: boolean = false;
private var gameLevel: int = 1;
private var maxGameLevel: int = 10;
private var roundsWon = 0;
private var coinsWon = 0;
private var lang: int = 1; // 1 = en-us, 2 = de-de
private var loca: CoinSnapLoc;
private var wallObject: GameObject;
private var barrelClone1: GameObject;
private var barrelClone2: GameObject;
private var barrelPos1: Vector3 = Vector3(-1.64, 0, 2.0);
private var barrelPos2: Vector3 = Vector3(1.84, 0, 2.0);

// Gui
var mainMenu:GameObject; //mainHUD prefeb to instantiate
private var mainMenuClone:GameObject;
private var mainPos:Vector3 = Vector3(0, 1, 9);
private var buttonPlay: UIButton;
var coinHUD:GameObject; //coinHUD prefeb to instantiate
private var coinHudClone:GameObject;
private var hudPos:Vector3 = Vector3(5, 1.2, 5); 
private var infoLabel:UILabel; // caching Label to use
private var roundLabel:UILabel;
private var NameLabel:UILabel;
private var MoneyLabel:UILabel;
private var LevelLabel:UILabel;

private var namePlayer1: String = "Type here";
private var namePlayer2: String = "Type here";
private var namePlayer3: String = "Type here";
private var namePlayer4: String = "Type here";

var UICredits: GameObject; // UICredits prefab to anstantiate
var coinRoundEnd: GameObject; // coinRoundEnd prefab to instantiate
private var coinRoundEndClone: GameObject;
private var scoreLabel: UILabel; // caching Label to use
private var nextLevelLabel: UILabel;
private var btGoOn: UIButton;
private var UICreditsClone: GameObject;
private var creditsPos:Vector3 = Vector3(7, 1, 10);


// State Vars
private var STATE_INIT_NEWGAME: int = 0;
private var STATE_NEWGAME: int = 1;
private var STATE_NEWRACE: int = 2;
private var STATE_NEXTPLAYER: int = 3;
private var STATE_COINISACTIVE: int = 4;
private var STATE_COINISONFLOOR: int = 5;
private var STATE_SCORE: int = 6;
private var STATE_LEVELEND: int = 7;
private var STATE_GAMEOVER: int = 8;
private var STATE_CREDITS: int = 9;
private var arStateNames = new Array("STATE_INIT_NEWGAME","STATE_NEWGAME","STATE_NEWRACE","STATE_NEXTPLAYER","STATE_COINISACTIVE","STATE_COINISONFLOOR","STATE_SCORE","STATE_LEVELEND","STATE_GAMEOVER", "STATE_CREDITS");

//private var state:int = null;
private var state: int;
private var done: boolean;
private var arState = new Array();
private var stateIndex:int = 0;

// Player Vars
private var arPlayerMoney = new Array();
private var arPlayerDistance = new Array();

// ----- functions ----
function Awake()
{
	for (var i:int = 0; i <= STATE_CREDITS; i++)
	{
		arState.Push(false);
	}
}
	
function Start () 
{
	wallObject = GameObject.FindGameObjectWithTag("Wall");
}

function Update () 
{
	if (coinActive)
	{
		if (SnapCoin != null)
		{
			SetNewCoinPos(SnapCoin.transform.position);
		}
	}
	
	for (var i:int = 0; i < arState.length; i++)
	{
		if (!arState[i])
		{
			state = i;
			break;
		}	
	}
	
	switch (state)
	{
		case STATE_INIT_NEWGAME:
			StateInitNewGame(state);
		break;
		case STATE_NEWGAME:
			StateNewGame(state);
		break;
		case STATE_NEWRACE:
			StateNewRace(state);
		break;
		case STATE_NEXTPLAYER:
			StateNextPlayer(state);
		break;
		case STATE_COINISACTIVE:
			StateCoinIsActive(state);
		break;
		case STATE_COINISONFLOOR:
			StateCoinIsOnFloor(state);
		break;
		case STATE_LEVELEND:
			StateLevelEnd(state);
		break;
		case STATE_SCORE:
			StateScore(state);
		break;
		case STATE_GAMEOVER:
			StateGameOver(state);
		break;
		case STATE_CREDITS:
			StateCredits(state);
		break;
		default:
		break;
	}
}


// state functions
function setStateInitNewGame()
{
	if (coinRoundEndClone != null)
	{
		Destroy(coinRoundEndClone);
	}
	if (coinHudClone != null)
	{
		Destroy(coinHudClone);
	}
	
	EditStatesFromState(STATE_INIT_NEWGAME);
}

function setStateNewGame()
{
	if (!arState[STATE_INIT_NEWGAME])
	{ 
		var cb:UICheckbox;
		countHumanPlayer = 1;
		countCompPlayer = 0;
		// count human and computer player 
		cb = GameObject.Find("Checkbox_H2").GetComponent(UICheckbox);
		if (cb.isChecked) countHumanPlayer++;
		cb = GameObject.Find("Checkbox_H3").GetComponent(UICheckbox);
		if (cb.isChecked) countHumanPlayer++;
		cb = GameObject.Find("Checkbox_H4").GetComponent(UICheckbox);
		if (cb.isChecked) countHumanPlayer++;
		
		cb = GameObject.Find("Checkbox_C2").GetComponent(UICheckbox);
		if (cb.isChecked) countCompPlayer++;
		cb = GameObject.Find("Checkbox_C3").GetComponent(UICheckbox);
		if (cb.isChecked) countCompPlayer++;
		cb = GameObject.Find("Checkbox_C4").GetComponent(UICheckbox);
		if (cb.isChecked) countCompPlayer++;
		
		countPlayer = countHumanPlayer + countCompPlayer;
		Destroy(mainMenuClone);
		arState[STATE_INIT_NEWGAME] = true;
	}
}

function setStateNewGameFromRoundEnd()
{
	if (coinRoundEndClone != null)
	{
		Destroy(coinRoundEndClone);
	}
	RoundEndShown = false;
	EditStatesFromState(STATE_NEWGAME);
	EditStatesToState(STATE_NEWGAME); // alles bis x auf true
}

function setStateGameOver()
{
	EditStatesToState(STATE_CREDITS); // alles bis x auf true
}

function StateInitNewGame(state:int)
{
	//Debug.Log("State: " + arStateNames[state]);
	if (mainMenuClone == null)
	{
		gameLevel = 1;
		loca = CoinLoca.GetComponent("CoinSnapLoc");
		CreateMainMenu();
	}	
}

function StateNewGame(state:int)
{
	if (!arState[state])
	{
		//Debug.Log("State: " + arStateNames[state]);
		var CoinName: String = "";
		ResetEverything();
		actualRound = 0;
		roundsWon = 0;
		coinsWon = 0;
		
		if (barrelClone1 != null)
		{
			Destroy(barrelClone1);
		}
		if (barrelClone2 != null)
		{
			Destroy(barrelClone2);
		}
				
		CreateHUD();
		
		switch (gameLevel)
		{
			case 0:
			case 1:
				wallObject.renderer.material = wallMats[0];
			break;
			case 2:
				wallObject.renderer.material = wallMats[1];
			break;
			case 3:
				wallObject.renderer.material = wallMats[2];
			break;
			case 4:
				wallObject.renderer.material = wallMats[3];
			break;
			case 5:
				wallObject.renderer.material = wallMats[0];
				placeBarrel1();
			break;
			case 6:
				wallObject.renderer.material = wallMats[1];
				placeBarrel2();
			break;
			case 7:
				wallObject.renderer.material = wallMats[2];
				placeBarrel1();
			break;
			case 8:
				wallObject.renderer.material = wallMats[3];
				placeBarrel2();
			break;
			case 9:
			case 10:
				wallObject.renderer.material = wallMats[0];
				placeBarrel1();
				placeBarrel2();
			break;
			default:
				wallObject.renderer.material = wallMats[0];
			break;
		}
	
		arState[state] = true;
	}
}

function StateNewRace(state:int)
{
	//Debug.Log("State: " + arStateNames[state]);
	if (!arState[state])
	{
		ResetCamera();
		ResetCoins();
		actualPlayer = -1;
		infoLabel = GameObject.Find("Label_Info").GetComponent(UILabel);
		infoLabel.enabled = false;
		winSplashShown = false;
				        		
		if (actualRound < maxRounds)
		{
			actualRound++;
			arState[state] = true;
		}
		else
		{
			RoundEndShown = false;
			EditStatesToState(STATE_LEVELEND);
		}
	}
}

function StateNextPlayer(state:int)
{

	if (!arState[state])
	{
		//Debug.Log("State: " + arStateNames[state]);
		actualPlayer++; // starts with -1 -> 0 at this point (due to array index)
		if (actualPlayer < countPlayer)
		{
			coinDoesntMove = 0;
			setHUDInfos();
			CreateCoin();
			
			if (actualPlayer < countHumanPlayer)
			{
				SnapCoin.GetComponent(CoinForce).setHumanTrue();
			}
			else
			{
				SnapCoin.GetComponent(CoinForce).setHumanFalse();
			}
			arState[state] = true;
		}
		else
		{
			EditStatesToState(STATE_SCORE);
			EditStatesFromState(STATE_SCORE);	
		}
	}
}

function StateCoinIsActive(state:int)
{
	//Debug.Log("State: " + arStateNames[state]);
	if (actualPlayer <= countPlayer)
	{
		if (!arState[state] && coinActive)
		{
			// wait until coin doesn't move anymore
			if (((newCoinPos == oldCoinPos) && (newCoinPos.y < 0.2)) || (newCoinPos.y < -20))
			{
				coinDoesntMove++;
				if (coinDoesntMove >= 5)
				{
					//Debug.Log("--- coin does not move ---");
					arState[state] = true;
				}
			}
			else
			{
				coinDoesntMove = 0;
			}
		}
	}
	else
	{
		arState[state] = true;
	}
}

function StateCoinIsOnFloor(state:int)
{
	//Debug.Log("State: " + arStateNames[state]);
	if (actualPlayer <= countPlayer)
	{
		if (!arState[state])
		{
			// Coin liegt
			// Entfernung zur Wand?
			arPlayerDistance[actualPlayer] = 3 - newCoinPos.z;
			//var coinLabelPos = newCoinPos;
			//coinLabelPos.y -= 10.0;
			var coinLabel = Instantiate(UICoinName, newCoinPos, Quaternion.identity);
			if (actualPlayer == 0) (coinLabel.GetComponent(TextMesh) as TextMesh).text = namePlayer1;
			if (actualPlayer == 1) (coinLabel.GetComponent(TextMesh) as TextMesh).text = namePlayer2;
			if (actualPlayer == 2) (coinLabel.GetComponent(TextMesh) as TextMesh).text = namePlayer3;
			if (actualPlayer == 3) (coinLabel.GetComponent(TextMesh) as TextMesh).text = namePlayer4;	
			arCoinLabels.push(coinLabel);

			if (actualPlayer == countPlayer)
			{
				arState[state] = true;
			}
			else
			{
				EditStatesFromState(STATE_NEXTPLAYER);
			}
		}
	}
}

function StateScore(state:int)
{
	//Debug.Log("State: " + arStateNames[state]);
	if (!arState[state])
	{
		if (actualPlayer <= countPlayer)
		{
			if (!winSplashShown)
			{
				// who wins?
				var Nearest:int = 0;
				var Distance:float = 999.99;
				var Winner:int = 0;
				for (var i:int = 0; i < countPlayer; i++ )
				{
					var Dist:float = arPlayerDistance[i];
					if (Dist < Distance)
					{
						Distance = Dist;
						Nearest = i;
					}
				}
				Winner = Nearest + 1;
				//Debug.Log("The winner is: " + Nearest);
				infoLabel = GameObject.Find("Label_Info").GetComponent(UILabel);
				if (Winner == 1) infoLabel.text = namePlayer1 + "\n";
				if (Winner == 2) infoLabel.text = namePlayer2 + "\n";
				if (Winner == 3) infoLabel.text = namePlayer3 + "\n";
				if (Winner == 4) infoLabel.text = namePlayer4 + "\n";
				infoLabel.text += loca.getLoc("youwin");
				infoLabel.enabled = true;
				
				nextGoOnTime = Time.time + 3;
				winSplashShown = true;
				// get the money
				for (i = 0; i < countPlayer; i++ )
				{
					var Money:int = arPlayerMoney[i];
					if (Nearest == i)
					{
						arPlayerMoney[i] = Money + (countPlayer - 1);
					}
					else
					{
						arPlayerMoney[i] = Money - 1;
					}
				}
				
				if (countHumanPlayer == 1)
				{
					if (Winner == 1)
					{
						roundsWon++;
					}
				}
			}
			if (Time.time > nextGoOnTime)
			{
				arState[state] = true;		
				EditStatesFromState(STATE_NEWRACE);
			}
		}
	}
}

function StateLevelEnd(state:int)
{
	//Debug.Log("State: " + arStateNames[state]);
	if (!arState[state])
	{
		if (!RoundEndShown)
		{
			//Debug.Log("State: " + arStateNames[state]);
			CreateRoundEndScreen();
			nextGoOnTime = Time.time + 999;
			RoundEndShown = true;
		}
		if (Time.time > nextGoOnTime)
		{
			arState[state] = true;
			RoundEndShown = false;
			coinRoundEndClone.SetActive(false);
			if (actualRound >= maxRounds)
			{				
				EditStatesFromState(STATE_INIT_NEWGAME); // alles auf false
				EditStatesToState(STATE_NEWGAME); // alles bis x auf true
			}
			else
			{
				EditStatesFromState(STATE_INIT_NEWGAME); // alles auf false
				EditStatesToState(STATE_NEWRACE); // alles bis x auf true	
			}
		}
	}
}

function StateGameOver(state:int)
{
	//Debug.Log("State: " + arStateNames[state]);
	if (!arState[state])
	{
		// dummy
		arState[state] = true;
	}
}

function StateCredits(state:int)
{
	//Debug.Log("State: " + arStateNames[state]);
	if (UICreditsClone == null)
	{
		UICreditsClone = Instantiate(UICredits, creditsPos, Quaternion.identity);
	}
	UICreditsClone.SetActive(true);
}

// GUI functions
function setNewLocalizationEng(setIt: boolean)
{
	if (setIt) 
	{
		lang = 1;
		localizeMainMenu();
	}
}

function setNewLocalizationGer(setIt: boolean)
{
	if (setIt) 
	{
		lang = 2;
		localizeMainMenu();
	}
}

function human2checked(setIt:boolean)
{
	if (setIt) 
	{
		var ib:UIInput = GameObject.Find("Input_Name_2").GetComponent(UIInput);
		if (isFree == false)
		{
			ib.text = loca.getLoc("hiertippen");
			ib.enabled = true;
		}
		else
		{
			ib.text = "Comp #1";
			ib.enabled = false;
			var cb:UICheckbox = GameObject.Find("Checkbox_H2").GetComponent(UICheckbox);
			cb.isChecked = false;
			cb = GameObject.Find("Checkbox_C2").GetComponent(UICheckbox);
			cb.isChecked = true;
		}
	}
}

function comp2checked(setIt:boolean)
{
	if (setIt) 
	{
		var ib:UIInput = GameObject.Find("Input_Name_2").GetComponent(UIInput);
		ib.enabled = false;
		var tempLabel:UILabel = GameObject.Find("Input_Name_2").GetComponentInChildren(UILabel);
		tempLabel.text = "Comp #1";
	}
}

function human3checked(setIt:boolean)
{
	var ib:UIInput = GameObject.Find("Input_Name_3").GetComponent(UIInput);
	if (setIt) 
	{
		if (isFree == false)
		{
			ib.text = loca.getLoc("hiertippen");
			ib.enabled = true;
		}
		else
		{
			ib.text = "Comp #2";
			ib.enabled = false;
			var cb:UICheckbox = GameObject.Find("Checkbox_H3").GetComponent(UICheckbox);
			cb.isChecked = false;
			cb = GameObject.Find("Checkbox_C3").GetComponent(UICheckbox);
			cb.isChecked = true;
		}
	}
	else
	{
		// could be none / not human and not comp
		ib.enabled = false;
		var tempLabel:UILabel = GameObject.Find("Input_Name_3").GetComponentInChildren(UILabel);
		tempLabel.text = "";
	}
}

function comp3checked(setIt:boolean)
{
	if (setIt) 
	{
		var ib:UIInput = GameObject.Find("Input_Name_3").GetComponent(UIInput);
		ib.enabled = false;
		var tempLabel:UILabel = GameObject.Find("Input_Name_3").GetComponentInChildren(UILabel);
		tempLabel.text = "Comp #2";
	}
}

function human4checked(setIt:boolean)
{
	var ib:UIInput = GameObject.Find("Input_Name_4").GetComponent(UIInput);
	if (setIt) 
	{
		if (isFree == false)
		{
			ib.text = loca.getLoc("hiertippen");
			ib.enabled = true;
		}
		else
		{
			ib.text = "Comp #3";
			ib.enabled = false;
			var cb:UICheckbox = GameObject.Find("Checkbox_H4").GetComponent(UICheckbox);
			cb.isChecked = false;
		}
	}
	else
	{
		// could be none / not human and not comp
		ib.enabled = false;
		var tempLabel:UILabel = GameObject.Find("Input_Name_4").GetComponentInChildren(UILabel);
		tempLabel.text = "";
	}
}

function comp4checked(setIt:boolean)
{
	GameObject.Find("Input_Name_4").GetComponent(UIInput).enabled = false;
	var tempLabel:UILabel = GameObject.Find("Input_Name_4").GetComponentInChildren(UILabel);
	if (setIt) 
	{
		var ib:UIInput = GameObject.Find("Input_Name_4").GetComponent(UIInput);
		ib.enabled = false;
		tempLabel.text = "Comp #3";
	}
	else
	{
		// could be none / not human and not comp
		tempLabel.text = "";
	}
}

function OnSubmit ()
{
	//var tempLabel:UILabel = GameObject.Find("Input_Name_1").GetComponentInChildren(UILabel);
	var ib:UIInput = GameObject.Find("Input_Name_1").GetComponent(UIInput);
	var text: String = ib.text;
	if ((ib != null) && (ib.enabled == true))
	{
		if (!String.IsNullOrEmpty(text))
		{
			if (text != "Type here")
			{	
				namePlayer1 = text.Trim();
				buttonPlay.isEnabled = true;
			}	
		}
	}
	
	
	ib = GameObject.Find("Input_Name_2").GetComponent(UIInput);
	text = ib.text;
	if (text == "")
	{
		var tempLabel: UILabel = GameObject.Find("Input_Name_2").GetComponentInChildren(UILabel);
		text = tempLabel.text;
	}
	namePlayer2 = text;
	
	ib = GameObject.Find("Input_Name_3").GetComponent(UIInput);
	text = ib.text;
	if (text == "")
	{
		tempLabel = GameObject.Find("Input_Name_3").GetComponentInChildren(UILabel);
		text = tempLabel.text;
	}
	namePlayer3 = text;
	
	ib = GameObject.Find("Input_Name_4").GetComponent(UIInput);
	text = ib.text;
	if (text == "")
	{
		tempLabel = GameObject.Find("Input_Name_4").GetComponentInChildren(UILabel);
		text = tempLabel.text;
	}
	namePlayer4 = text;
}

// misc functions
function placeBarrel1()
{
	if (barrelClone1 == null)
	{
		barrelClone1 = Instantiate(Barrel, barrelPos1, Quaternion.identity);
	}
	barrelClone1.SetActive(true);	
}

function placeBarrel2()
{
	if (barrelClone2 == null)
	{
		barrelClone2 = Instantiate(Barrel, barrelPos2, Quaternion.identity);
	}
	barrelClone2.SetActive(true);	
}

function CreateMainMenu()
{
	if (mainMenuClone == null)
	{
		mainMenuClone = Instantiate(mainMenu, mainPos, Quaternion.identity); 
	}
	mainMenuClone.SetActive(true);
	var ib:UIInput;
	var cb:UICheckbox;
	var go:GameObject = GameObject.FindGameObjectWithTag("fsm");
	
	cb = GameObject.Find("Checkbox_L1").GetComponent(UICheckbox);
	cb.eventReceiver = go;
	cb = GameObject.Find("Checkbox_L2").GetComponent(UICheckbox);
	cb.eventReceiver = go;
	
	cb = GameObject.Find("Checkbox_H2").GetComponent(UICheckbox);
	cb.eventReceiver = go;
	cb = GameObject.Find("Checkbox_H3").GetComponent(UICheckbox);
	cb.eventReceiver = go;
	cb = GameObject.Find("Checkbox_H4").GetComponent(UICheckbox);
	cb.eventReceiver = go;
	
	cb = GameObject.Find("Checkbox_C2").GetComponent(UICheckbox);
	cb.eventReceiver = go;
	cb = GameObject.Find("Checkbox_C3").GetComponent(UICheckbox);
	cb.eventReceiver = go;
	cb = GameObject.Find("Checkbox_C4").GetComponent(UICheckbox);
	cb.eventReceiver = go;
		
	ib = GameObject.Find("Input_Name_1").GetComponent(UIInput);
	ib.eventReceiver = go;
	ib = GameObject.Find("Input_Name_2").GetComponent(UIInput);
	ib.eventReceiver = go;
	ib.enabled = false;
	ib = GameObject.Find("Input_Name_3").GetComponent(UIInput);
	ib.eventReceiver = go;
	ib.enabled = false;
	ib = GameObject.Find("Input_Name_4").GetComponent(UIInput);
	ib.eventReceiver = go;
	ib.enabled = false;
	
	buttonPlay = GameObject.Find("Button_Play").GetComponent(UIButton);
	buttonPlay.isEnabled = false;
	localizeMainMenu();
}

function CreateHUD()
{
	if (coinHudClone == null)
	{
		coinHudClone = Instantiate(coinHUD, hudPos, Quaternion.identity);
	}
	coinHudClone.SetActive(true);
	infoLabel = GameObject.Find("Label_Info").GetComponent(UILabel);
	infoLabel.enabled = false;
	
	LocalizeCoinHUD();
}

function setHUDInfos()
{
	roundLabel = GameObject.Find("Label_Round").GetComponent(UILabel);
	roundLabel.text = "[2EFE2E]" + actualRound.ToString() + "[-]";
	
	NameLabel = GameObject.Find("Label_Name").GetComponent(UILabel);
	if (actualPlayer == 0) NameLabel.text = "[2EFE2E]" + namePlayer1 + "[-]";
	if (actualPlayer == 1) NameLabel.text = "[2EFE2E]" + namePlayer2 + "[-]";
	if (actualPlayer == 2) NameLabel.text = "[2EFE2E]" + namePlayer3 + "[-]";
	if (actualPlayer == 3) NameLabel.text = "[2EFE2E]" + namePlayer4 + "[-]";
	
	MoneyLabel = GameObject.Find("Label_Money").GetComponent(UILabel);
	MoneyLabel.text = "[2EFE2E]" + arPlayerMoney[actualPlayer].ToString() + "[-]";
	
	LevelLabel = GameObject.Find("Label_Level").GetComponent(UILabel);
	if (countHumanPlayer == 1)
	{
		LevelLabel.text = "[2EFE2E]" + gameLevel.ToString() + "[-]";
	}
	else
	{
		LevelLabel.text = "[2EFE2E] - [-]";
	}
}

function CreateRoundEndScreen()
{
	if (coinRoundEndClone == null)
	{
		coinRoundEndClone = Instantiate(coinRoundEnd, hudPos, Quaternion.identity);
	}
	coinRoundEndClone.SetActive(true);
	setRoundEndInfos();
}

function setRoundEndInfos()
{
	var arScore = new Array();
	var strScore: String = ""; 
	scoreLabel = GameObject.Find("Label_Score").GetComponent(UILabel);
	nextLevelLabel = GameObject.Find("Label_NextLevel").GetComponent(UILabel);
	btGoOn = GameObject.Find("Button_GoOn").GetComponent(UIButton);
	
	// who wins?
	var Best:int = 0;
	var Credits:int = -1;
	var gefunden: boolean = false;
	var place:int = 0;
	var nextLevel: boolean = false;
	var BestPlayer:int = 0;
	while (true)
	{
		for (var i:int = 0; i < countPlayer; i++ )
		{
			var Cr:int = arPlayerMoney[i];
			if ((Cr > Credits) && (Cr >= 0))
			{
				Credits = Cr;
				Best = i;
				gefunden = true;
			}
		}
		BestPlayer = Best + 1;
		if (gefunden)
		{
			place++;
			strScore += place.ToString();
			strScore += ". ";
			if (BestPlayer == 1) strScore += "[2EFE2E]" + namePlayer1 + "[-]";
			if (BestPlayer == 2) strScore += "[2EFE2E]" + namePlayer2 + "[-]";
			if (BestPlayer == 3) strScore += "[2EFE2E]" + namePlayer3 + "[-]";
			if (BestPlayer == 4) strScore += "[2EFE2E]" + namePlayer4 + "[-]";
			strScore += " - ";
			strScore += Credits.ToString();
			strScore += " " + loca.getLoc("geld") + "\n";
						
			if ((countHumanPlayer == 1) && (BestPlayer == 1))
			{
				// only if 1 human
				coinsWon = Credits - startEuros;
				
				if ((place == 1) && (Best < 1))
				{
					nextLevel = true;
					gameLevel++;
				}
			}
			gefunden = false;
			arPlayerMoney[Best] = -1;
			Credits = -1;
		}
		else
		{
			break;
		}
	}
	
	if (countHumanPlayer == 1)
	{
		strScore += "\n";
		switch (roundsWon)
		{
			case 0:
			case 1:
			case 2:
			case 3:
				strScore += loca.getLoc("daswarnichts");
			break;	
			case 4:
				strScore += "";
			break;
			case 5:
				strScore += loca.getLoc("eswirdbesser");
			break;	
			case 6:
			case 7:
				strScore += loca.getLoc("sogehts");
			break;
			case 8:
				strScore += loca.getLoc("grossartig");
			break;
			case 9:
				strScore += loca.getLoc("wunderbar");
			break;
			case 10:
				strScore += loca.getLoc("koenig");
			break;
			default:
			break;
		}
		strScore += "\n";
		
		if (coinsWon > 0)
		{
			strScore += loca.getLoc("duhastgewonnen") + " " + coinsWon.ToString() + " " + loca.getLoc("geld");
			if (lang == 2) strScore += " " + loca.getLoc("gewonnen");
			strScore += "!";	
		}
		else
		{
			strScore += loca.getLoc("duhastverloren")+" "+Mathf.Abs(coinsWon).ToString()+" "+ loca.getLoc("geld");
			if (lang == 2) strScore += " " + loca.getLoc("verloren");
			strScore += "!";
		}	
	}
	scoreLabel.text = strScore;
	
	var tempLabel: UILabel = GameObject.Find("Button_NewGame").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("newgame");
	tempLabel = GameObject.Find("Button_GoOn").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("goon");
	
	if (countHumanPlayer == 1)
	{
		if (gameLevel <= maxGameLevel)
		{
			if (nextLevel)
			{
				nextLevelLabel.text = loca.getLoc("nextlevel");
			}
			else
			{
				nextLevelLabel.text = "";
			}
		}
		else
		{
			nextLevelLabel.text = loca.getLoc("maxlevel");
			btGoOn.isEnabled = false;
		}
	}
	else
	{
		nextLevelLabel.text = "";	
	}
}

function localizeMainMenu()
{	
	loca.setLang(lang);
	var cb:UICheckbox;
	
	var tempLabel: UILabel = GameObject.Find("Label_Player").GetComponent(UILabel);
	tempLabel.text = loca.getLoc("spieler");
	tempLabel = GameObject.Find("Checkbox_H1").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("human");
	tempLabel = GameObject.Find("Checkbox_H2").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("human") + "*";;
	tempLabel = GameObject.Find("Checkbox_H3").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("human") + "*";;
	tempLabel = GameObject.Find("Checkbox_H4").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("human") + "*";;
	tempLabel = GameObject.Find("Label_Name").GetComponent(UILabel);
	tempLabel.text = loca.getLoc("deinname");
	tempLabel = GameObject.Find("Input_Name_1").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("hiertippen");
	if (isFree == false)
	{
		var ib:UIInput = GameObject.Find("Input_Name_2").GetComponent(UIInput);
		if (ib.enabled == true)
		{
			ib.text = loca.getLoc("hiertippen");
		}
		else
		{
			ib.text = "Comp #1";
		}
		
		ib = GameObject.Find("Input_Name_3").GetComponent(UIInput);
		if (ib.enabled == true)
		{
			ib.text = loca.getLoc("hiertippen");
		}
		else
		{
			tempLabel = GameObject.Find("Input_Name_3").GetComponentInChildren(UILabel);
			cb = GameObject.Find("Checkbox_C3").GetComponent(UICheckbox);
			if (cb.isChecked == true)
			{
				ib.text = "Comp #2";
			}
			else
			{
				tempLabel.text = "";
			}	
		}
		
		ib = GameObject.Find("Input_Name_4").GetComponent(UIInput);
		if (ib.enabled == true)
		{
			ib.text = loca.getLoc("hiertippen");
		}
		else
		{
			tempLabel = GameObject.Find("Input_Name_4").GetComponentInChildren(UILabel);
			cb = GameObject.Find("Checkbox_C4").GetComponent(UICheckbox);
			if (cb.isChecked == true)
			{
				ib.text = "Comp #3";
			}
			else
			{
				tempLabel.text = "";
			}	
		}
	}
	else
	{
		tempLabel = GameObject.Find("Input_Name_2").GetComponentInChildren(UILabel);
		tempLabel.text = "Comp #1";
		tempLabel = GameObject.Find("Input_Name_3").GetComponentInChildren(UILabel);
		tempLabel.text = "Comp #2";
		tempLabel = GameObject.Find("Input_Name_4").GetComponentInChildren(UILabel);
		tempLabel.text = "";
	}
	tempLabel = GameObject.Find("Button_Play").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("spielen");
	tempLabel = GameObject.Find("Button_Credits").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("abspann");
	
	tempLabel = GameObject.Find("Label_Copyright").GetComponent(UILabel);
	tempLabel.text = loca.getLoc("bezahl");
}

function LocalizeCoinHUD()
{
	var tempLabel: UILabel = GameObject.Find("Label_Bez3").GetComponent(UILabel);
	tempLabel.text = loca.getLoc("runde");
	tempLabel = GameObject.Find("Label_Bez4").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("level");
	tempLabel = GameObject.Find("Label_Bez1").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("spielername");
	tempLabel = GameObject.Find("Label_Bez2").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("geld");
}

function coinIsReady()
{
	Camera.main.GetComponent(SmoothFollow).target = null;
	ResetCamera();
}

function setStateCoinIsActive()
{
	coinActive = true;
	if (actualPlayer < countHumanPlayer)
	{
		Camera.main.GetComponent(SmoothFollow).target = SnapCoin.transform;
	}
	else
	{
		Camera.main.GetComponent(SmoothFollow).target = null;
	}
}

function setStateCredits()
{
	EditStatesToState(STATE_CREDITS); // alles bis x auf true
}

function CreateCoin()
{
	arCoins.push(Instantiate(Coin, coinPos, Quaternion.identity));
	SnapCoin = arCoins[actualPlayer];
	coinActive = false;
	for (var i:int = 1; i < gameLevel; i++)
	{
		SnapCoin.GetComponent(CoinForce).increseLevelMalus();
	}
}

function SetNewCoinPos(pos:Vector3)
{
	oldCoinPos = newCoinPos;
	newCoinPos = pos;
}

function EditStatesFromState(FromState: int)
{
	// sets all states to false at and after FromState	
	for (var i:int = FromState; i < arState.length; i++)
	{
		arState[i] = false;	
	}	
}

function EditStatesToState(ToState: int)
{
	// sets all states to true until ToState	
	for (var i:int = 0; i < ToState; i++)
	{
		arState[i] = true;	
	}
	stateIndex = 0;	
}

function ResetHUD()
{
	if (coinHudClone != null)
	{
		coinHudClone.SetActive(false);
	}
}

function ResetRoundEnd()
{
	if (coinRoundEndClone != null)
	{
		coinRoundEndClone.SetActive(false);
	}
}

function ResetCoins()
{
	for (var i:int = 0; i < arCoins.length; i++)
	{
		Destroy(arCoins[i]);
		Destroy(arCoinLabels[i]);
	}
	arCoins.clear();
	arCoinLabels.clear();
}
function ResetCamera()
{
	Camera.main.SendMessage("ResetPosition");
}

function ResetPlayers()
{
	arPlayerMoney.clear();
	arPlayerDistance.clear();
	for (var i:int = 0; i <= countPlayer; i++ )
	{
		arPlayerMoney.Push(startEuros);
		arPlayerDistance.Push(999.99);
	}
	actualPlayer = -1;
}

function ResetEverything()
{
	ResetHUD();
	ResetRoundEnd();
	ResetCamera();
	ResetPlayers();
	ResetCoins();
}
