using UnityEngine;
using System.Collections;

public class ClickEventBack : MonoBehaviour {

	public enum Trigger
	{
		OnClick,
		OnMouseOver,
		OnMouseOut,
		OnPress,
		OnRelease,
	}

	public Trigger trigger = Trigger.OnClick;
	private GameObject UICredits;
	private GameObject CoinSnapLogic;
		
	void OnClick ()
	{
		if (enabled && trigger == Trigger.OnClick)
		{
			UICredits = GameObject.FindGameObjectWithTag("Credits");
			UICredits.SetActive(false);
			
			CoinSnapLogic = GameObject.FindGameObjectWithTag("fsm");
			CoinSnapLogic.SendMessage("setStateInitNewGame");
		}
	}
}
