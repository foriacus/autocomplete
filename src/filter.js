var Filter = (function() {
var Filter = {
        'default': function(data) {return data;},

        'startsWith': function(data, query, options) {
            query = query || '';
            var result = [], l = query.length,
                reg = new RegExp('^' + escapeKeyword(query));

            if (!l) return [];

            $.each(data, function(index, item) {
                var a, matchKeys = getMatchKey(item, options);

                // 匹配 value 和 alias 中的
                while(a = matchKeys.shift()) {
                    if (reg.test(a)) {
                        // 匹配和显示相同才有必要高亮
                        if (item.value === a) {
                            item.highlightIndex = [[0, l]];
                        }
                        if(!item.value) {
                            var _item = {};
                            _item.label = item;
                            _item.value = "";
                            result.push(_item);
                            break;
                        }
                        result.push(item);
                        break;
                    }
                }
            });
            return result;
        },

        'stringMatch': function(data, query) {
            query = query || '';
            var result = [], l = query.length;

            if (!l) return [];

            $.each(data, function(index, item) {
                var a, matchKeys = [item.value].concat(item.alias);

                // 匹配 value 和 alias 中的
                while(a = matchKeys.shift()) {
                    if (a.indexOf(query) > -1) {
                        // 匹配和显示相同才有必要高亮

                        if (item.label === a) {
                            item.highlightIndex = stringMatch(a, query);
                        }

                        result.push(item);
                        break;
                    }
                }
            });
            return result;
        }
    };

    function getMatchKey(item, options) {
        if ($.isPlainObject(item)) {
            return [item.label].concat(item.alias).concat(item.value);
        } else {
            return [item];
        }
    }

    function stringMatch(matchKey, query) {
        var r = [], a = matchKey.split('');
        var queryIndex = 0, q = query.split('');
        for (var i = 0, l = a.length; i < l; i++) {
            var v = a[i];
            if (v === q[queryIndex]) {
                if (queryIndex === q.length -1) {
                    r.push([i - q.length + 1,i + 1]);
                    queryIndex = 0;
                    continue;
                }
                queryIndex++;
            } else {
                queryIndex = 0;
            }
        }
        return r;
    }

    // 转义正则关键字
    var keyword = /(\[|\[|\]|\^|\$|\||\(|\)|\{|\}|\+|\*|\?)/g;
    function escapeKeyword (str) {
      return (str || '').replace(keyword, '\\$1');
    }

    return Filter
})()