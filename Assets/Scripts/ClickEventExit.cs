using UnityEngine;
using System.Collections;

public class ClickEventExit : MonoBehaviour {

	public enum Trigger
	{
		OnClick,
		OnMouseOver,
		OnMouseOut,
		OnPress,
		OnRelease,
	}

	public Trigger trigger = Trigger.OnClick;
	private GameObject CoinSnapLogic;
		
	void OnClick ()
	{
		if (enabled && trigger == Trigger.OnClick)
		{			
			CoinSnapLogic = GameObject.FindGameObjectWithTag("fsm");
			CoinSnapLogic.SendMessage("setStateGameOver");
		}
	}
}
