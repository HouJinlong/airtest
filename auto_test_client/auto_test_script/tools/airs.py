from git import Repo
from auto_test_script.tools.config import AIR_ROOT
import os

def init_air(data):
    airs_root = os.path.join(AIR_ROOT,data['git_id'])
    print(airs_root)
    if(os.path.exists(airs_root)):
        r = Repo(airs_root)
    else:
        r = Repo.clone_from(data['git_url'],airs_root)
    
    if(data['git_update']):
        r.remote().pull()

    return  {
        'script':os.path.join(airs_root,data['path']),
        'version':[str(i) for i in r.iter_commits()][0][:7]
    }

