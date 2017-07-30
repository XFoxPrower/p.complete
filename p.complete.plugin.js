//META{"name":"pcomplete"}*//

'use strict';

function pcomplete()
	{
	function unobs(level)
		{
		switch(level)
			{
			case 1:
				{
				if(obs_sectionChange)
					{
					obs_sectionChange.disconnect();
					obs_sectionChange=null;
					}
				}
			case 2:
				{
				if(obs_roomChange)
					{
					obs_roomChange.disconnect();
					obs_roomChange=null;
					}
				}
			case 3:
				{
				if(textarea)
					{
					textarea.removeEventListener('keydown',tabWatch);
					textarea=null;
					}
				}
			}
		}

	function sectionChange()
		{
		const
			room=section.getElementsByClassName('messages-wrapper')[0].parentNode;

		unobs(2);
		if(room)
			{
			obs_roomChange=new MutationObserver(roomChange);
			obs_roomChange.observe(room,{childList:1});
			roomChange();
			}
		}

	function roomChange()
		{
		const
			url=location.href;

		unobs(3);
		results=[];
		idx=0;
		if(~url.indexOf('channels')&&!~url.indexOf('@'))
			{
			textarea=section.getElementsByTagName('textarea')[0];
			textarea.addEventListener('keydown',tabWatch);
			}
		}

	function tabWatch(e)
		{
		var
			val,
			sep,
			leni,
			resx,
			search,
			groups,
			i,
			xi,
			lenj,
			j,
			xj,
			nick,
			user;

		if(e.key=='Tab')
			{
			val=textarea.value;
			sep=val.lastIndexOf(' ');
			if(!~sep)
				{
				sep=val.lastIndexOf('\n');
				}
			leni=results.length;
			if(entry&&leni)
				{
				idx++;
				if(idx==leni)
					{
					idx=0;
					}
				resx=results[idx];
				textarea.value=subLeft+'@'+resx.username+'#'+resx.disc+' ';
				}
			else
				{
				subLeft=val.substring(0,sep+1);
				search=val.substring(sep+1,val.length).toLowerCase();
				if(search)
					{
					groups=section.getElementsByClassName('channel-members-wrap')[0];
					if(groups)
						{
						groups=groups.parentNode;
						groups=groups[Object.keys(groups)[0]]._renderedChildren['.1']._instance.state.memberGroups;
						leni=groups.length;
						for(i=0;i<leni;i++)
							{
							xi=groups[i].users;
							lenj=xi.length;
							for(j=0;j<lenj;j++)
								{
								xj=xi[j];
								nick=xj.nick;
								user=xj.user;
								xj={nick:nick,username:user.username,disc:user.discriminator};
								if(nick.toLowerCase().startsWith(search))
									{
									results.push(xj);
									}
								}
							}
						}
					if(results.length)
						{
						resx=results[idx];
						textarea.value=subLeft+'@'+resx.username+'#'+resx.disc+' ';
						}
					entry=1;
					}
				}
			}
		else
			{
			entry=idx=0;
			subLeft='';
			results=[];
			}
		}

	const
		_=this,
		D=document;
	var
		section,
		obs_sectionChange,
		obs_roomChange,
		textarea,
		subLeft,
		entry,
		results,
		idx;

	_.getName=()=>'p.complete';
	_.getDescription=()=>'IRC-style auto-complete';
	_.getVersion=()=>'0.05';
	_.getAuthor=()=>'XFox Prower';
	_.load=()=>{}
	_.start=()=>
		{
		section=D.getElementsByTagName('section')[0];
		obs_sectionChange=new MutationObserver(sectionChange);
		obs_sectionChange.observe(section,{childList:1});
		sectionChange();
		};
	_.stop=()=>
		{
		unobs(1);
		section=subLeft=entry=results=idx=null;
		};
	}
