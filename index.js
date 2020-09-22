const MapID = 3202;
const TemplateID = 1000;

module.exports = function DahGuide(mod) {
	let insideMap,jokesEnabled,isHealer = false;
	let noticeEnabled = true;
	let enabled = true;
	let alertsEnabled = true;
	let BossID  = -1;
	let hooks = [];
	
	mod.hook('S_LOAD_TOPO', 3, (event) => 
	{
		insideMap = event.zone === MapID;
		if(insideMap)
			Load();
		else
			Unload();
    });
	
	mod.command.add(['dah'], (arg) => {
		if (!arg) 
		{
			enabled=!enabled;
			NoticeMessage(`ur stupid dah guide just got ${enabled ? 'enabled' : 'disabled'}`);
		}
		else
			switch (arg)
			{
				case "alerts":
				case "alert":
				case "a":
				alertsEnabled = !alertsEnabled;
				NoticeMessage(`Alerts just got ${alertsEnabled ? 'enabled' : 'disabled'}`);
				break;
				case "f":
				case "j":
				jokesEnabled = !jokesEnabled
				NoticeMessage(`Absolute masterpiece alerts just got ${jokesEnabled ? 'enabled ^.^' : 'disabled t(-_-t)'}`);
				break;
				case "n":
				case "notice":
				noticeEnabled = !noticeEnabled;
				NoticeMessage(noticeEnabled ? 'Notices enabled':'');
			}
	});
	
	mod.hook('S_SPAWN_ME', 3, (event) => 
	{
		if (!enabled || !insideMap) return;
		setTimeout(() => {AlertMessage('WELLCOME TO MY FUCK HOUSE BITCHES -_-*,,|,');}, 6000); //cringy af
		isHealer = mod.game.me.class ==='elementalist' || mod.game.me.class ==='priest';
	});
	
	
	function Load()
	{
		Hook('S_ACTION_STAGE', 9, (event)=>
		{
			if(!enabled || !insideMap)
				return;
			if(event.templateId !== TemplateID)
				return;
				
			BossID = event.gameid;
			var actionTip = GetTip(event.skill.id%1000);
			if(actionTip)
			{
				if(noticeEnabled)
					NoticeMessage(actionTip.Notice);
				if(alertsEnabled)
					AlertMessage(jokesEnabled ? actionTip.Alert : actionTip.Notice);		
			}	
		});
		
		Hook('S_ABNORMALITY_BEGIN', 4, (event)=>
		{
			if(!enabled || !insideMap)
				return;
			if(mod.game.me.is(event.target))
			{
				/*TODO: roast when player outranges the donuts*/
			}
			else if (event.target === BossID)
			{
				/*TODO: log more data*/
			}
		});	
	}
	
	function Hook() 
	{
		hooks.push(mod.hook(...arguments));
	}
	function Unload() 
	{
		if (hooks.length) 
		{
			for (let h of hooks)
				mod.unhook(h);
			hooks = [];
		}
	}
	
	function AlertMessage(msg) 
	{
		if(NullOrEmpty(msg))
			return;
		mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
			type: 43,
			chat: 0,
			channel: 0,
			message: msg
		});
	}
	
	function NoticeMessage(msg) 
	{
		if(NullOrEmpty(msg))
			return
		mod.send('S_CHAT', 3, {
			channel: 21,
			name: 'Guide',
			message: msg
		});		
	}
	
	function NullOrEmpty(str) { return (!str || 0 === str.length);}
	
	function GetTip(actionID)
	{
		switch(actionID)
		{	
			case 109: return {Notice: 'Knock down -> Spin',Alert:'Imagine dying to THIS .... G.A.R.B.A.G.E'};
			case 119: return {Notice: 'Spin !',Alert:'SPEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEN'};
			case 105: return {Notice: 'Small AoE stun coming',Alert:'Only fucktards would get stunned right about ........... NOW'};
			case 106: return {Notice: 'Small AoE stun',Alert:'If u r stunned, u r an absolute FUCKtard, srsly'};
			case 111: return {Notice: 'Jumping to stun',Alert:'Its jumping for ur mom'};
			case 110: return {Notice: 'In Out with wave',Alert:'GV copy paste mech'};
			case 107: return {Notice: 'Range Check',Alert:'Such a idiot'};
			case 120: return {Notice: 'Big AoE stun coming',Alert:'BEGONE .......'};
			case 114: return {Notice: 'Big AoE stun',Alert:'THOT'};
			case 128: return {Notice: 'Outter to Inner donuts',Alert: isHealer ? 'Use thral (FUCK PRIESTS KAIA <^>(-_-)<^>)':'Rage ur heal if u died'};
			case 127: return {Notice: 'Inner to Outter donuts',Alert:isHealer ? 'Use thral (FUCK PRIESTS KAIA <^>(-_-)<^>)':'Rage ur heal if u died'};
			case 121: return {Notice: '4 phase attack (Inner to Out donuts)',Alert:'Outrange or GID GUD'};
			case 124: return {Notice: '4 phase attack (Outter to In donuts)',Alert:'Outrange or GID GUD'};
			case  -4: return {Notice: isHealer? 'Regress & Heal':'Break shield', Alert: isHealer?'Regress BIACH! (FUCK RPIESTS <^>(-_-)<^>)' : 'RAGE UR HEAL ... RAGE UR HEAL ... RAGE UR HEAL'};
			default : return undefined;
		}
	}
}