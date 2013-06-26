#pragma strict
private var startPos: Vector3;
private var startRot: Vector3;

function Awake()
{
	// save initial pos and rot of object
	startPos = transform.localPosition;
	startRot = transform.localEulerAngles;
}

function ResetPosition()
{
	transform.localPosition = startPos;
	transform.localEulerAngles = startRot;
	
	// stop physics if any
	if (rigidbody != null)
	{
		rigidbody.velocity = Vector3.zero;
		rigidbody.angularVelocity = Vector3.zero;
	}
}
