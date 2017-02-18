//META{"name":"pcomplete"}*//
'use strict';
function pcomplete()
	{
	const
		_=this,
		D=document;
	var
		obs_sectionChange,
		obs_chatChange,
		listener;
	_.getName=()=>'p.complete';
	_.getDescription=()=>'IRC-style auto-complete';
	_.getVersion=()=>'0.01';
	_.getAuthor=()=>'XFox Prower';
	_.load=function(){};
	_.start=function()
		{
		function sectionChange()
			{
			function chatChange()
				{
				function tabWatch(e)
					{
					var
						val,
						sep,
						search,
						groups,
						leni,
						i,
						xi,
						lenj,
						j,
						xj,
						nick,
						user,
						resx;
					if(e.key=='Tab')
						{
						val=textarea.value;
						sep=val.lastIndexOf(' ');
						leni=results.length;
						if(entry&&leni)
							{
							idx++;
							if(idx==leni)
								{
								idx=0;
								}
							resx=results[idx];
							textarea.value=subLeft+' @'+resx.username+'#'+resx.disc+' ';
							}
						else
							{
							subLeft=val.substring(0,sep);
							search=val.substring(sep+1,val.length).toLowerCase();
							if(search)
								{
								groups=section.getElementsByClassName('channel-members-wrap')[0].parentNode;
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
								if(results.length)
									{
									resx=results[idx];
									textarea.value=subLeft+' @'+resx.username+'#'+resx.disc+' ';
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
					url=location.href;
				var
					textarea,
					entry,
					subLeft,
					results=[],
					idx=0;
				if(~url.indexOf('channels')&&!~url.indexOf('@'))
					{
					textarea=section.getElementsByTagName('textarea')[0];
					textarea.addEventListener('keydown',tabWatch);
					listener=tabWatch;
					}
				}
			const
				obs_chatChange=new MutationObserver(chatChange),
				titleWrap=section.getElementsByClassName('title-wrap')[0];
			if(titleWrap)
				{
				obs_chatChange.observe(titleWrap,{childList:1});
				chatChange();
				}
			}
		const
			section=D.getElementsByTagName('section')[0],
			obs_sectionChange=new MutationObserver(sectionChange);
		obs_sectionChange.observe(section,{childList:1});
		sectionChange();
		};
	_.stop=function()
		{
		if(obs_sectionChange){obs_sectionChange.disconnect();}
		if(obs_chatChange){obs_chatChange.disconnect();}
		if(listener){D.getElementsByTagName('textarea')[0].removeEventListener('keydown',listener);}
		obs_sectionChange=obs_chatChange=listener=null;
		};
	}