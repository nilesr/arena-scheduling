ORDER := lib/net.js lib/groupby.js lib/groupby.js lib/killticket.js lib/cats.js lib/components/login.js lib/components/logout.js lib/components/loading.js lib/components/expando.js lib/components/classname.js lib/components/section.js lib/components/classrow.js lib/components/classes.js lib/components/smallschedule.js lib/components/schedule.js lib/components/tabs.js lib/components/timecover.js lib/components/waitlistswarning.js lib/components/errorboundary.js lib/components/app.js lib/components/admin/adminview.js lib/components/admin/adminstudentview.js lib/components/admin/admintabs.js lib/components/admin/adminclasses.js lib/components/admin/adminclassrow.js lib/components/admin/adminsection.js lib/components/admin/adminclassroster.js lib/components/admin/adminstudentsearch.js lib/components/admin/adminexport.js lib/components/scheduletable.js lib/components/alert.js lib/components/modal.js lib/components/comments.js lib/app.js

all: final.min.js

node_modules/.bin/babel:
	npm install --save-dev @babel/preset-react @babel/core @babel/cli @babel/preset-env core-js

node_modules/.bin/browserify:
	npm install --save-dev browserify

node_modules/%:
	npm install --save-dev $(subst $@,node_modules/,)

node_modules/.bin/uglify:
	npm install --save-dev uglify grunt grunt-contrib-copy grunt-contrib-uglify grunt-contrib-concat grunt-contrib-clean @babel/polyfill

lib/%.js: node_modules/.bin/babel js/%.js
	node_modules/.bin/babel js --out-dir lib

final.js: node_modules/.bin/browserify $(ORDER)
	node_modules/.bin/browserify $(ORDER) -o final.js

final.min.js: node_modules/.bin/uglify final.js
	node_modules/.bin/uglify -s final.js -o final.min.js

clean:
	rm -rf final.js final.min.js lib node_modules

.PHONY: clean all
