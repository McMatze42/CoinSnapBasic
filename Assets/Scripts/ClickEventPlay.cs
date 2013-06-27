using UnityEngine;
using System.Collections;

public class ClickEventPlay : MonoBehaviour 
{
	public enum Trigger
	{
		OnClick,
		OnMouseOver,
		OnMouseOut,
		OnPress,
		OnRelease,
	}

	public Trigger trigger = Trigger.OnClick;
	private GameObject StartMenu;
	private GameObject CoinSnapLogic;
		
	void OnClick ()
	{
		if (enabled && trigger == Trigger.OnClick)
		{
			//StartMenu = GameObject.FindGameObjectWithTag("startmenu");
			//StartMenu.SetActive(false);
			
			CoinSnapLogic = GameObject.FindGameObjectWithTag("fsm");
			CoinSnapLogic.SendMessage("setStateNewGame");
		}
	}
}
