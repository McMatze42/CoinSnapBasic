#pragma strict
#pragma downcast

// Game
var Coin:GameObject; // coin prefab to instantiate
var SnapCoin:GameObject; // the active coin
var UICoinName:GameObject; // the prefab of the coin label
var CoinLoca:GameObject; // the prefab of the coin label
private var isFree: boolean = false;
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

var coinRoundEnd: GameObject; // coinRoundEnd prefab to instantiate
private var coinRoundEndClone: GameObject;
var scoreLabel: UILabel; // caching Label to use
var nextLevelLabel: UILabel;
var btNewGame: UIButton;
var UICredits: GameObject; // UICredits prefab to anstantiate
private var UICreditsClone: GameObject;
private var creditsPos:Vector3 = Vector3(7, 1, 10);


// State Vars
private var STATE_INIT_NEWGAME: int = 0;
private var STATE_NEWGAME: int = 1;
private var STATE_NEWROUND: int = 2;
private var STATE_NEXTPLAYER: int = 3;
private var STATE_COINISACTIVE: int = 4;
private var STATE_COINISONFLOOR: int = 5;
private var STATE_SCORE: int = 6;
private var STATE_LEVELEND: int = 7;
private var STATE_GAMEOVER: int = 8;
private var STATE_CREDITS: int = 9;
private var arStateNames = new Array("STATE_INIT_NEWGAME","STATE_NEWGAME","STATE_NEWROUND","STATE_NEXTPLAYER","STATE_COINISACTIVE","STATE_COINISONFLOOR","STATE_SCORE","STATE_LEVELEND","STATE_GAMEOVER", "STATE_CREDITS");

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
	//buttonPlay.isEnabled(false);
}
	
function Start () 
{
	
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
	
	//Debug.Log("State: " + arStateNames[state]);
	switch (state)
	{
		case STATE_INIT_NEWGAME:
			StateInitNewGame(state);
		break;
		case STATE_NEWGAME:
			StateNewGame(state);
		break;
		case STATE_NEWROUND:
			StateNewRound(state);
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
		ib.enabled = true;
	}
}

function comp2checked(setIt:boolean)
{
	if (setIt) 
	{
		var ib:UIInput = GameObject.Find("Input_Name_2").GetComponent(UIInput);
		ib.enabled = false;
	}
}

function human3checked(setIt:boolean)
{
	if (setIt) 
	{
		var ib:UIInput = GameObject.Find("Input_Name_3").GetComponent(UIInput);
		ib.enabled = true;
	}
}

function comp3checked(setIt:boolean)
{
	if (setIt) 
	{
		var ib:UIInput = GameObject.Find("Input_Name_3").GetComponent(UIInput);
		ib.enabled = false;
	}
}

function human4checked(setIt:boolean)
{
	if (setIt) 
	{
		var ib:UIInput = GameObject.Find("Input_Name_4").GetComponent(UIInput);
		ib.enabled = true;
	}
}

function comp4checked(setIt:boolean)
{
	if (setIt) 
	{
		var ib:UIInput = GameObject.Find("Input_Name_4").GetComponent(UIInput);
		ib.enabled = false;
	}
}

function OnSubmit ()
{
	var tempLabel:UILabel = GameObject.Find("Input_Name_1").GetComponentInChildren(UILabel);
	var text: String = tempLabel.text;
	if (!String.IsNullOrEmpty(text))
	{
		if (text != "Type here")
		{	
			namePlayer1 = text;
			buttonPlay.isEnabled = true;
		}	
	}
	
	var ib:UIInput = GameObject.Find("Input_Name_2").GetComponent(UIInput);
	if ((ib != null) && (ib.enabled == true))
	{
		text = ib.text;
		if (!String.IsNullOrEmpty(text))
		{
			if (text != "Type here")
			{	
				namePlayer2 = text;
			}	
		}
	}
	
	ib = GameObject.Find("Input_Name_3").GetComponent(UIInput);
	if ((ib != null) && (ib.enabled == true))
	{
		text = ib.text;
		if (!String.IsNullOrEmpty(text))
		{
			if (text != "Type here")
			{	
				namePlayer3 = text;
			}	
		}
	}
	
	ib = GameObject.Find("Input_Name_4").GetComponent(UIInput);
	if ((ib != null) && (ib.enabled == true))
	{
		text = ib.text;
		if (!String.IsNullOrEmpty(text))
		{
			if (text != "Type here")
			{	
				namePlayer4 = text;
			}	
		}
	}
}

// state functions

function setStateInitNewGame()
{
	EditStatesFromState(STATE_INIT_NEWGAME);
}

function setStateNewGame()
{
	if (!arState[STATE_INIT_NEWGAME])
	{ 
		countHumanPlayer = 0;
		countCompPlayer = 0;
		// count human and computer player 
		var cb:UICheckbox = GameObject.Find("Checkbox_H1").GetComponent(UICheckbox);
		if (cb.isChecked) countHumanPlayer++;
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
		
		arState[STATE_INIT_NEWGAME] = true;
	}
}

function setStateNewGameFromRoundEnd()
{
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
	if (mainMenuClone == null)
	{
		gameLevel = 1;
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
		CreateHUD();
	
		arState[state] = true;
	}
}

function StateNewRound(state:int)
{
	//Debug.Log("State: " + state);
	if (!arState[state])
	{
		//Debug.Log("State: " + arStateNames[state]);
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
			EditStatesToState(STATE_LEVELEND);
		}
	}
}

function StateNextPlayer(state:int)
{

	if (!arState[state])
	{
		//Debug.Log("State: " + arStateNames[state]);
		actualPlayer++;
		if (actualPlayer <= countPlayer)
		{
			coinDoesntMove = 0;
			setHUDInfos();
			CreateCoin();
			
			if (actualPlayer < 1)
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
			EditStatesFromState(STATE_NEWROUND);	
		}
	}
}

function StateCoinIsActive(state:int)
{
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
			if (actualPlayer < 1)
			{
				(coinLabel.GetComponent(TextMesh) as TextMesh).text = namePlayer1;
			}
			else
			{
				(coinLabel.GetComponent(TextMesh) as TextMesh).text = "Comp #" + actualPlayer.ToString();
			}	
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
	if (!arState[state])
	{
		if (actualPlayer <= countPlayer)
		{
			if (!winSplashShown)
			{
				// who wins?
				var Nearest:int = 0;
				var Distance:float = 999.99;
				for (var i:int = 0; i <= countPlayer; i++ )
				{
					var Dist:float = arPlayerDistance[i];
					if (Dist < Distance)
					{
						Distance = Dist;
						Nearest = i;
					}
				}
				//Debug.Log("The winner is: " + Nearest);
				infoLabel = GameObject.Find("Label_Info").GetComponent(UILabel);
				if (Nearest == 0)
				{
					
					infoLabel.text = "YOU WIN!";
					roundsWon++;
				}
				else
				{
					infoLabel.text = "YOU LOSE!";
				}
				infoLabel.enabled = true;
				nextGoOnTime = Time.time + 3;
				winSplashShown = true;
				// get the money
				for (i = 0; i <= countPlayer; i++ )
				{
					var Money:int = arPlayerMoney[i];
					if (Nearest == i)
					{
						arPlayerMoney[i] = Money + countPlayer;
					}
					else
					{
						arPlayerMoney[i] = Money - 1;
					}
				}
			}
			if (Time.time > nextGoOnTime)
			{
				arState[state] = true;		
				EditStatesFromState(STATE_NEWROUND);
			}
		}
	}
}

function StateLevelEnd(state:int)
{
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
				EditStatesToState(STATE_NEWROUND); // alles bis x auf true	
			}
		}
	}
}

function StateGameOver(state:int)
{
	if (!arState[state])
	{
		//Debug.Log("State: " + arStateNames[state]);
		// EndScreen zeigen
		arState[state] = true;
	}
}

function StateCredits(state:int)
{
	if (UICreditsClone == null)
	{
		UICreditsClone = Instantiate(UICredits, creditsPos, Quaternion.identity);
	}
	UICreditsClone.SetActive(true);
}

// misc functions
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
	
	cb = GameObject.Find("Checkbox_H2").GetComponent(UICheckbox);
	cb.eventReceiver = go;
	cb = GameObject.Find("Checkbox_C2").GetComponent(UICheckbox);
	cb.eventReceiver = go;
	cb = GameObject.Find("Checkbox_H3").GetComponent(UICheckbox);
	cb.eventReceiver = go;
	cb = GameObject.Find("Checkbox_C3").GetComponent(UICheckbox);
	cb.eventReceiver = go;
	cb = GameObject.Find("Checkbox_H4").GetComponent(UICheckbox);
	cb.eventReceiver = go;
	cb = GameObject.Find("Checkbox_C4").GetComponent(UICheckbox);
	cb.eventReceiver = go;
		
	ib = GameObject.Find("Input_Name_1").GetComponent(UIInput);
	ib.eventReceiver = go;
	ib = GameObject.Find("Input_Name_2").GetComponent(UIInput);
	ib.eventReceiver = go;
	ib = GameObject.Find("Input_Name_3").GetComponent(UIInput);
	ib.eventReceiver = go;
	ib = GameObject.Find("Input_Name_4").GetComponent(UIInput);
	ib.eventReceiver = go;
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
}

function setHUDInfos()
{
	roundLabel = GameObject.Find("Label_Round").GetComponent(UILabel);
	roundLabel.text = "[2EFE2E]" + actualRound.ToString() + "[-]";
	
	NameLabel = GameObject.Find("Label_Name").GetComponent(UILabel);
	if (actualPlayer < 1)
	{
		NameLabel.text = "[2EFE2E]" + namePlayer1 + "[-]";
	}
	else
	{
		NameLabel.text = "[2EFE2E]" + "Comp #" + actualPlayer.ToString() + "[-]";
	}
	
	MoneyLabel = GameObject.Find("Label_Money").GetComponent(UILabel);
	MoneyLabel.text = "[2EFE2E]" + arPlayerMoney[actualPlayer].ToString() + "[-]";
	
	LevelLabel = GameObject.Find("Label_Level").GetComponent(UILabel);
	LevelLabel.text = "[2EFE2E]" + gameLevel.ToString() + "[-]";
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
	btNewGame = GameObject.Find("Button_NewGame").GetComponent(UIButton);
	
	// who wins?
	var Best:int = 0;
	var Credits:int = -1;
	var gefunden: boolean = false;
	var place:int = 0;
	var nextLevel: boolean = false;
	while (true)
	{
		for (var i:int = 0; i <= countPlayer; i++ )
		{
			var Cr:int = arPlayerMoney[i];
			if ((Cr > Credits) && (Cr >= 0))
			{
				Credits = Cr;
				Best = i;
				gefunden = true;
			}
		}
		if (gefunden)
		{
			place++;
			if (Best < 1)
			{
				strScore += place.ToString();
				strScore += ". ";
				strScore += namePlayer1;
				strScore += " - ";
				strScore += Credits.ToString();
				strScore += " Credits\n";
				coinsWon = Credits - startEuros; 
			}
			else
			{
				strScore += place.ToString();
				strScore += ". ";
				strScore += "Comp #";
				strScore += Best.ToString();
				strScore += " - ";
				strScore += Credits.ToString();
				strScore += " Credits\n";
			}
			
			if ((place == 1) && (Best == 0))
			{
				nextLevel = true;
				gameLevel++;
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
	strScore += "\n";
	switch (roundsWon)
	{
		case 0:
		case 1:
		case 2:
		case 3:
			strScore += "Well, try again.";
		break;	
		case 4:
			strScore += "";
		break;
		case 5:
			strScore += "It's getting better.";
		break;	
		case 6:
		case 7:
			strScore += "Yes! You got it!";
		break;
		case 8:
			strScore += "Wow...great!";
		break;
		case 9:
			strScore += "Awesome! 9/10 rounds!";
		break;
		case 10:
			strScore += "You are the Coin King!";
		break;
		default:
		break;
	}
	strScore += "\n";
	
	if (coinsWon >= 0)
	{
		strScore += "You have won " + coinsWon.ToString() + " Credits!";	
	}
	else
	{
		strScore += "You lost "+ Mathf.Abs(coinsWon).ToString() + " Credits!";
	}	
	
	scoreLabel.text = strScore;
	
	if (gameLevel <= maxGameLevel)
	{
		if (nextLevel)
		{
			nextLevelLabel.text = "Yeah, you gain the\nNEXT LEVEL !";
		}
		else
		{
			nextLevelLabel.text = "";
		}
	}
	else
	{
		nextLevelLabel.text = "Awesome!\nYou have reached the maximum level!\nGame Over...";
		btNewGame.isEnabled = false;
	}
}

function localizeMainMenu()
{
	var loca:CoinSnapLoc = CoinLoca.GetComponent("CoinSnapLoc");
	loca.setLang(lang);
	
	var tempLabel: UILabel = GameObject.Find("Label_Player").GetComponent(UILabel);
	tempLabel.text = loca.getLoc("spieler");
	tempLabel = GameObject.Find("Checkbox_H1").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("human");
	tempLabel = GameObject.Find("Checkbox_H2").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("human");
	tempLabel = GameObject.Find("Checkbox_H3").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("human");
	tempLabel = GameObject.Find("Checkbox_H4").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("human");
	tempLabel = GameObject.Find("Label_Name").GetComponent(UILabel);
	tempLabel.text = loca.getLoc("deinname");
	tempLabel = GameObject.Find("Input_Name_1").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("hiertippen");
	tempLabel = GameObject.Find("Input_Name_2").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("hiertippen");
	tempLabel = GameObject.Find("Input_Name_3").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("hiertippen");
	tempLabel = GameObject.Find("Input_Name_4").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("hiertippen");
	tempLabel = GameObject.Find("Button_Play").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("spielen");
	tempLabel = GameObject.Find("Button_Credits").GetComponentInChildren(UILabel);
	tempLabel.text = loca.getLoc("abspann");
}

function setStateCoinIsActive()
{
	coinActive = true;
		
	if (actualPlayer < 1)
	{
		Camera.main.GetComponent(SmoothFollow).target = SnapCoin.transform;
	}
	else
	{
		Camera.main.GetComponent(SmoothFollow).target = null;
		ResetCamera();
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
	//Debug.Log("--- EditStatesFromState --- " + FromState);
	// sets all states to false at and after FromState	
	for (var i:int = FromState; i < arState.length; i++)
	{
		arState[i] = false;	
	}	
}

function EditStatesToState(ToState: int)
{
	//Debug.Log("--- EditStatesToState --- " + ToState);
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
