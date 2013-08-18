
// minifier: path aliases

enyo.path.addPaths({layout: "C://Users/Shantanu/Documents/GitHub/SeamlessNotes/enyo/../lib/layout/", onyx: "C://Users/Shantanu/Documents/GitHub/SeamlessNotes/enyo/../lib/onyx/", onyx: "C://Users/Shantanu/Documents/GitHub/SeamlessNotes/enyo/../lib/onyx/source/"});

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var e = 0, t = this.container.children, n; n = t[e]; e++) if (n.fit && n.showing) return e;
},
getFitControl: function() {
var e = this.container.children, t = e[this.fitIndex];
return t && t.fit && t.showing || (this.fitIndex = this.calcFitIndex(), t = e[this.fitIndex]), t;
},
getLastControl: function() {
var e = this.container.children, t = e.length - 1, n = e[t];
while ((n = e[t]) && !n.showing) t--;
return n;
},
_reflow: function(e, t, n, r) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var i = this.getFitControl();
if (!i) return;
var s = 0, o = 0, u = 0, a, f = this.container.hasNode();
f && (a = enyo.dom.calcPaddingExtents(f), s = f[t] - (a[n] + a[r]));
var l = i.getBounds();
o = l[n] - (a && a[n] || 0);
var c = this.getLastControl();
if (c) {
var h = enyo.dom.getComputedBoxValue(c.hasNode(), "margin", r) || 0;
if (c != i) {
var p = c.getBounds(), d = l[n] + l[e], v = p[n] + p[e] + h;
u = v - d;
} else u = h;
}
var m = s - (o + u);
i.applyStyle(e, m + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
clientClasses: "",
clientStyle: "",
rowOffset: 0
},
events: {
onSetupItem: "",
onRenderRow: ""
},
bottomUp: !1,
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
create: function() {
this.inherited(arguments), this.noSelectChanged(), this.multiSelectChanged(), this.clientClassesChanged(), this.clientStyleChanged();
},
noSelectChanged: function() {
this.noSelect && this.$.selection.clear();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
clientClassesChanged: function() {
this.$.client.setClasses(this.clientClasses);
},
clientStyleChanged: function() {
this.$.client.setStyle(this.clientStyle);
},
setupItem: function(e) {
this.doSetupItem({
index: e,
selected: this.isSelected(e)
});
},
generateChildHtml: function() {
var e = "";
this.index = null;
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("data-enyo-index", n), e += this.inherited(arguments), this.$.client.teardownRender();
return e;
},
previewDomEvent: function(e) {
var t = this.index = this.rowForEvent(e);
e.rowIndex = e.index = t, e.flyweight = this;
},
decorateEvent: function(e, t, n) {
var r = t && t.index != null ? t.index : this.index;
t && r != null && (t.index = r, t.flyweight = this), this.inherited(arguments);
},
tap: function(e, t) {
if (this.noSelect || t.index === -1) return;
this.toggleSelected ? this.$.selection.toggle(t.index) : this.$.selection.select(t.index);
},
selectDeselect: function(e, t) {
this.renderRow(t.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(e) {
return this.getSelection().isSelected(e);
},
renderRow: function(e) {
if (e < this.rowOffset || e >= this.count + this.rowOffset) return;
this.setupItem(e);
var t = this.fetchRowNode(e);
t && (enyo.dom.setInnerHtml(t, this.$.client.generateChildHtml()), this.$.client.teardownChildren(), this.doRenderRow({
rowIndex: e
}));
},
fetchRowNode: function(e) {
if (this.hasNode()) return this.node.querySelector('[data-enyo-index="' + e + '"]');
},
rowForEvent: function(e) {
if (!this.hasNode()) return -1;
var t = e.target;
while (t && t !== this.node) {
var n = t.getAttribute && t.getAttribute("data-enyo-index");
if (n !== null) return Number(n);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
if (e < 0 || e >= this.count) return;
this.setupItem(e);
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
if (e < 0 || e >= this.count) return;
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n;
t && (t.id !== e.id ? n = t.querySelector("#" + e.id) : n = t), e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
for (var r = 0, i = e.children, s; s = i[r]; r++) this.claimNode(s, t);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1,
reorderable: !1,
centerReorderContainer: !0,
reorderComponents: [],
pinnedReorderComponents: [],
swipeableComponents: [],
enableSwipe: !1,
persistSwipeableItem: !1
},
events: {
onSetupItem: "",
onSetupReorderComponents: "",
onSetupPinnedReorderComponents: "",
onReorder: "",
onSetupSwipeItem: "",
onSwipeDrag: "",
onSwipe: "",
onSwipeComplete: ""
},
handlers: {
onAnimateFinish: "animateFinish",
onRenderRow: "rowRendered",
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onup: "up",
onholdpulse: "holdpulse"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "holdingarea",
allowHtml: !0,
classes: "enyo-list-holdingarea"
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0;"
} ]
} ],
reorderHoldTimeMS: 600,
draggingRowIndex: -1,
draggingRowNode: null,
placeholderRowIndex: -1,
dragToScrollThreshold: .1,
prevScrollTop: 0,
autoScrollTimeoutMS: 20,
autoScrollTimeout: null,
autoscrollPageY: 0,
pinnedReorderMode: !1,
initialPinPosition: -1,
itemMoved: !1,
currentPageNumber: -1,
completeReorderTimeout: null,
swipeIndex: null,
swipeDirection: null,
persistentItemVisible: !1,
persistentItemOrigin: null,
swipeComplete: !1,
completeSwipeTimeout: null,
completeSwipeDelayMS: 500,
normalSwipeSpeedMS: 200,
fastSwipeSpeedMS: 100,
percentageDraggedThreshold: .2,
importProps: function(e) {
e && e.reorderable && (this.touch = !0), this.inherited(arguments);
},
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.noSelectChanged(), this.multiSelectChanged(), this.toggleSelectedChanged(), this.$.generator.setRowOffset(0), this.$.generator.setCount(this.count);
},
initComponents: function() {
this.createReorderTools(), this.inherited(arguments), this.createSwipeableComponents();
},
createReorderTools: function() {
this.createComponent({
name: "reorderContainer",
classes: "enyo-list-reorder-container",
ondown: "sendToStrategy",
ondrag: "sendToStrategy",
ondragstart: "sendToStrategy",
ondragfinish: "sendToStrategy",
onflick: "sendToStrategy"
});
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
createSwipeableComponents: function() {
for (var e = 0; e < this.swipeableComponents.length; e++) this.$.swipeableComponents.createComponent(this.swipeableComponents[e], {
owner: this.owner
});
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
noSelectChanged: function() {
this.$.generator.setNoSelect(this.noSelect);
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
sendToStrategy: function(e, t) {
this.$.strategy.dispatchEvent("on" + t.type, t, e);
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
holdpulse: function(e, t) {
if (!this.getReorderable() || this.isReordering()) return;
if (t.holdTime >= this.reorderHoldTimeMS && this.shouldStartReordering(e, t)) return t.preventDefault(), this.startReordering(t), !1;
},
dragstart: function(e, t) {
if (this.isReordering()) return !0;
if (this.isSwipeable()) return this.swipeDragStart(e, t);
},
drag: function(e, t) {
if (this.shouldDoReorderDrag(t)) return t.preventDefault(), this.reorderDrag(t), !0;
if (this.isSwipeable()) return t.preventDefault(), this.swipeDrag(e, t), !0;
},
dragfinish: function(e, t) {
this.isReordering() ? this.finishReordering(e, t) : this.isSwipeable() && this.swipeDragFinish(e, t);
},
up: function(e, t) {
this.isReordering() && this.finishReordering(e, t);
},
generatePage: function(e, t) {
this.page = e;
var n = this.rowsPerPage * this.page;
this.$.generator.setRowOffset(n);
var r = Math.min(this.count - n, this.rowsPerPage);
this.$.generator.setCount(r);
var i = this.$.generator.generateChildHtml();
t.setContent(i), this.getReorderable() && this.draggingRowIndex > -1 && this.hideReorderingRow();
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
this.pageHeights[e] = s, this.portSize += s - o;
}
},
pageForRow: function(e) {
return Math.floor(e / this.rowsPerPage);
},
preserveDraggingRowNode: function(e) {
this.draggingRowNode && this.pageForRow(this.draggingRowIndex) === e && (this.$.holdingarea.hasNode().appendChild(this.draggingRowNode), this.draggingRowNode = null, this.removedInitialPage = !0);
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 === 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.preserveDraggingRowNode(this.p0), this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0, this.p0RowBounds = this.getPageRowHeights(this.$.page0)), s = i % 2 === 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.preserveDraggingRowNode(this.p1), this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0, this.p1RowBounds = this.getPageRowHeights(this.$.page1)), t && (this.$.generator.setRowOffset(0), this.$.generator.setCount(this.count), this.fixedHeight || (this.adjustBottomPage(), this.adjustPortSize()));
},
getPageRowHeights: function(e) {
var t = {}, n = e.hasNode().querySelectorAll("div[data-enyo-index]");
for (var r = 0, i, s; r < n.length; r++) i = n[r].getAttribute("data-enyo-index"), i !== null && (s = enyo.dom.getBounds(n[r]), t[parseInt(i, 10)] = {
height: s.height,
width: s.width
});
return t;
},
updateRowBounds: function(e) {
this.p0RowBounds[e] ? this.updateRowBoundsAtIndex(e, this.p0RowBounds, this.$.page0) : this.p1RowBounds[e] && this.updateRowBoundsAtIndex(e, this.p1RowBounds, this.$.page1);
},
updateRowBoundsAtIndex: function(e, t, n) {
var r = n.hasNode().querySelector('div[data-enyo-index="' + e + '"]'), i = enyo.dom.getBounds(r);
t[e].height = i.height, t[e].width = i.width;
},
updateForPosition: function(e) {
this.update(this.calcPos(e));
},
calcPos: function(e) {
return this.bottomUp ? this.portSize - this.scrollerHeight - e : e;
},
adjustBottomPage: function() {
var e = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(e.pageNo, e);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var e = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", e + "px");
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e);
t.applyStyle(this.pageBound, n + "px");
},
pageToPosition: function(e) {
var t = 0, n = e;
while (n > 0) n--, t += this.getPageHeight(n);
return t;
},
positionToPageInfo: function(e) {
var t = -1, n = this.calcPos(e), r = this.defaultPageHeight;
while (n >= 0) t++, r = this.getPageHeight(t), n -= r;
return t = Math.max(t, 0), {
no: t,
height: r,
pos: n + r,
startRow: t * this.rowsPerPage,
endRow: Math.min((t + 1) * this.rowsPerPage - 1, this.count - 1)
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
var t = this.pageHeights[e];
if (!t) {
var n = this.rowsPerPage * e, r = Math.min(this.count - n, this.rowsPerPage);
t = this.defaultPageHeight * (r / this.rowsPerPage);
}
return Math.max(1, t);
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.p0RowBounds = {}, this.p1RowBounds = {}, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments), r = this.getScrollTop();
return this.lastPos === r ? n : (this.lastPos = r, this.update(r), this.pinnedReorderMode && this.reorderScroll(e, t), n);
},
setScrollTop: function(e) {
this.update(e), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(e) {
this.setScrollTop(this.calcPos(e));
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
scrollToRow: function(e) {
var t = this.pageForRow(e), n = e % this.rowsPerPage, r = this.pageToPosition(t);
this.updateForPosition(r), r = this.pageToPosition(t), this.setScrollPosition(r);
if (t == this.p0 || t == this.p1) {
var i = this.$.generator.fetchRowNode(e);
if (i) {
var s = i.offsetTop;
this.bottomUp && (s = this.getPageHeight(t) - i.offsetHeight - s);
var o = this.getScrollPosition() + s;
this.setScrollPosition(o);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(e, t) {
return this.getSelection().select(e, t);
},
deselect: function(e) {
return this.getSelection().deselect(e);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
this.$.generator.renderRow(e);
},
rowRendered: function(e, t) {
this.updateRowBounds(t.rowIndex);
},
prepareRow: function(e) {
this.$.generator.prepareRow(e);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(e, t, n) {
this.$.generator.performOnRow(e, t, n);
},
animateFinish: function(e) {
return this.twiddle(), !0;
},
twiddle: function() {
var e = this.getStrategy();
enyo.call(e, "twiddle");
},
pageForPageNumber: function(e, t) {
return e % 2 === 0 ? !t || e === this.p0 ? this.$.page0 : null : !t || e === this.p1 ? this.$.page1 : null;
},
shouldStartReordering: function(e, t) {
return !!this.getReorderable() && t.rowIndex >= 0 && !this.pinnedReorderMode && e === this.$.strategy && t.index >= 0 ? !0 : !1;
},
startReordering: function(e) {
this.$.strategy.listReordering = !0, this.buildReorderContainer(), this.doSetupReorderComponents(e), this.styleReorderContainer(e), this.draggingRowIndex = this.placeholderRowIndex = e.rowIndex, this.draggingRowNode = e.target, this.removedInitialPage = !1, this.itemMoved = !1, this.initialPageNumber = this.currentPageNumber = this.pageForRow(e.rowIndex), this.prevScrollTop = this.getScrollTop(), this.replaceNodeWithPlaceholder(e.rowIndex);
},
buildReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.reorderComponents.length; e++) this.$.reorderContainer.createComponent(this.reorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
styleReorderContainer: function(e) {
this.setItemPosition(this.$.reorderContainer, e.rowIndex), this.setItemBounds(this.$.reorderContainer, e.rowIndex), this.$.reorderContainer.setShowing(!0), this.centerReorderContainer && this.centerReorderContainerOnPointer(e);
},
appendNodeToReorderContainer: function(e) {
this.$.reorderContainer.createComponent({
allowHtml: !0,
content: e.innerHTML
}).render();
},
centerReorderContainerOnPointer: function(e) {
var t = enyo.dom.calcNodePosition(this.hasNode()), n = e.pageX - t.left - parseInt(this.$.reorderContainer.domStyles.width, 10) / 2, r = e.pageY - t.top + this.getScrollTop() - parseInt(this.$.reorderContainer.domStyles.height, 10) / 2;
this.getStrategyKind() != "ScrollStrategy" && (n -= this.getScrollLeft(), r -= this.getScrollTop()), this.positionReorderContainer(n, r);
},
positionReorderContainer: function(e, t) {
this.$.reorderContainer.addClass("enyo-animatedTopAndLeft"), this.$.reorderContainer.addStyles("left:" + e + "px;top:" + t + "px;"), this.setPositionReorderContainerTimeout();
},
setPositionReorderContainerTimeout: function() {
this.clearPositionReorderContainerTimeout(), this.positionReorderContainerTimeout = setTimeout(enyo.bind(this, function() {
this.$.reorderContainer.removeClass("enyo-animatedTopAndLeft"), this.clearPositionReorderContainerTimeout();
}), 100);
},
clearPositionReorderContainerTimeout: function() {
this.positionReorderContainerTimeout && (clearTimeout(this.positionReorderContainerTimeout), this.positionReorderContainerTimeout = null);
},
shouldDoReorderDrag: function() {
return !this.getReorderable() || this.draggingRowIndex < 0 || this.pinnedReorderMode ? !1 : !0;
},
reorderDrag: function(e) {
this.positionReorderNode(e), this.checkForAutoScroll(e), this.updatePlaceholderPosition(e.pageY);
},
updatePlaceholderPosition: function(e) {
var t = this.getRowIndexFromCoordinate(e);
t !== -1 && (t >= this.placeholderRowIndex ? this.movePlaceholderToIndex(Math.min(this.count, t + 1)) : this.movePlaceholderToIndex(t));
},
positionReorderNode: function(e) {
var t = this.$.reorderContainer.getBounds(), n = t.left + e.ddx, r = t.top + e.ddy;
r = this.getStrategyKind() == "ScrollStrategy" ? r + (this.getScrollTop() - this.prevScrollTop) : r, this.$.reorderContainer.addStyles("top: " + r + "px ; left: " + n + "px"), this.prevScrollTop = this.getScrollTop();
},
checkForAutoScroll: function(e) {
var t = enyo.dom.calcNodePosition(this.hasNode()), n = this.getBounds(), r;
this.autoscrollPageY = e.pageY, e.pageY - t.top < n.height * this.dragToScrollThreshold ? (r = 100 * (1 - (e.pageY - t.top) / (n.height * this.dragToScrollThreshold)), this.scrollDistance = -1 * r) : e.pageY - t.top > n.height * (1 - this.dragToScrollThreshold) ? (r = 100 * ((e.pageY - t.top - n.height * (1 - this.dragToScrollThreshold)) / (n.height - n.height * (1 - this.dragToScrollThreshold))), this.scrollDistance = 1 * r) : this.scrollDistance = 0, this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling();
},
stopAutoScrolling: function() {
this.autoScrollTimeout && (clearTimeout(this.autoScrollTimeout), this.autoScrollTimeout = null);
},
startAutoScrolling: function() {
this.autoScrollTimeout = setInterval(enyo.bind(this, this.autoScroll), this.autoScrollTimeoutMS);
},
autoScroll: function() {
this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling(), this.setScrollPosition(this.getScrollPosition() + this.scrollDistance), this.positionReorderNode({
ddx: 0,
ddy: 0
}), this.updatePlaceholderPosition(this.autoscrollPageY);
},
movePlaceholderToIndex: function(e) {
var t, n;
if (e < 0) return;
e >= this.count ? (t = null, n = this.pageForPageNumber(this.pageForRow(this.count - 1)).hasNode()) : (t = this.$.generator.fetchRowNode(e), n = t.parentNode);
var r = this.pageForRow(e);
r >= this.pageCount && (r = this.currentPageNumber), n.insertBefore(this.placeholderNode, t), this.currentPageNumber !== r && (this.updatePageHeight(this.currentPageNumber), this.updatePageHeight(r), this.updatePagePositions(r)), this.placeholderRowIndex = e, this.currentPageNumber = r, this.itemMoved = !0;
},
finishReordering: function(e, t) {
if (!this.isReordering() || this.pinnedReorderMode || this.completeReorderTimeout) return;
return this.stopAutoScrolling(), this.$.strategy.listReordering = !1, this.moveReorderedContainerToDroppedPosition(t), this.completeReorderTimeout = setTimeout(enyo.bind(this, this.completeFinishReordering, t), 100), t.preventDefault(), !0;
},
moveReorderedContainerToDroppedPosition: function() {
var e = this.getRelativeOffset(this.placeholderNode, this.hasNode()), t = this.getStrategyKind() == "ScrollStrategy" ? e.top : e.top - this.getScrollTop(), n = e.left - this.getScrollLeft();
this.positionReorderContainer(n, t);
},
completeFinishReordering: function(e) {
this.completeReorderTimeout = null, this.placeholderRowIndex > this.draggingRowIndex && (this.placeholderRowIndex = Math.max(0, this.placeholderRowIndex - 1));
if (this.draggingRowIndex == this.placeholderRowIndex && this.pinnedReorderComponents.length && !this.pinnedReorderMode && !this.itemMoved) {
this.beginPinnedReorder(e);
return;
}
this.removeDraggingRowNode(), this.removePlaceholderNode(), this.emptyAndHideReorderContainer(), this.pinnedReorderMode = !1, this.reorderRows(e), this.draggingRowIndex = this.placeholderRowIndex = -1, this.refresh();
},
beginPinnedReorder: function(e) {
this.buildPinnedReorderContainer(), this.doSetupPinnedReorderComponents(enyo.mixin(e, {
index: this.draggingRowIndex
})), this.pinnedReorderMode = !0, this.initialPinPosition = e.pageY;
},
emptyAndHideReorderContainer: function() {
this.$.reorderContainer.destroyComponents(), this.$.reorderContainer.setShowing(!1);
},
buildPinnedReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.pinnedReorderComponents.length; e++) this.$.reorderContainer.createComponent(this.pinnedReorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
reorderRows: function(e) {
this.doReorder(this.makeReorderEvent(e)), this.positionReorderedNode(), this.updateListIndices();
},
makeReorderEvent: function(e) {
return e.reorderFrom = this.draggingRowIndex, e.reorderTo = this.placeholderRowIndex, e;
},
positionReorderedNode: function() {
if (!this.removedInitialPage) {
var e = this.$.generator.fetchRowNode(this.placeholderRowIndex);
e && (e.parentNode.insertBefore(this.hiddenNode, e), this.showNode(this.hiddenNode)), this.hiddenNode = null;
if (this.currentPageNumber != this.initialPageNumber) {
var t, n, r = this.pageForPageNumber(this.currentPageNumber), i = this.pageForPageNumber(this.currentPageNumber + 1);
this.initialPageNumber < this.currentPageNumber ? (t = r.hasNode().firstChild, i.hasNode().appendChild(t)) : (t = r.hasNode().lastChild, n = i.hasNode().firstChild, i.hasNode().insertBefore(t, n)), this.correctPageHeights(), this.updatePagePositions(this.initialPageNumber);
}
}
},
updateListIndices: function() {
if (this.shouldDoRefresh()) {
this.refresh(), this.correctPageHeights();
return;
}
var e = Math.min(this.draggingRowIndex, this.placeholderRowIndex), t = Math.max(this.draggingRowIndex, this.placeholderRowIndex), n = this.draggingRowIndex - this.placeholderRowIndex > 0 ? 1 : -1, r, i, s, o;
if (n === 1) {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r && r.setAttribute("data-enyo-index", "reordered");
for (i = t - 1, s = t; i >= e; i--) {
r = this.$.generator.fetchRowNode(i);
if (!r) continue;
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o + 1, r.setAttribute("data-enyo-index", s);
}
r = this.hasNode().querySelector('[data-enyo-index="reordered"]'), r.setAttribute("data-enyo-index", this.placeholderRowIndex);
} else {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r && r.setAttribute("data-enyo-index", this.placeholderRowIndex);
for (i = e + 1, s = e; i <= t; i++) {
r = this.$.generator.fetchRowNode(i);
if (!r) continue;
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o - 1, r.setAttribute("data-enyo-index", s);
}
}
},
shouldDoRefresh: function() {
return Math.abs(this.initialPageNumber - this.currentPageNumber) > 1;
},
getNodeStyle: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) return;
var n = this.getRelativeOffset(t, this.hasNode()), r = enyo.dom.getBounds(t);
return {
h: r.height,
w: r.width,
left: n.left,
top: n.top
};
},
getRelativeOffset: function(e, t) {
var n = {
top: 0,
left: 0
};
if (e !== t && e.parentNode) do n.top += e.offsetTop || 0, n.left += e.offsetLeft || 0, e = e.offsetParent; while (e && e !== t);
return n;
},
replaceNodeWithPlaceholder: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) {
enyo.log("No node - " + e);
return;
}
this.placeholderNode = this.createPlaceholderNode(t), this.hiddenNode = this.hideNode(t);
var n = this.pageForPageNumber(this.currentPageNumber);
n.hasNode().insertBefore(this.placeholderNode, this.hiddenNode);
},
createPlaceholderNode: function(e) {
var t = this.$.placeholder.hasNode().cloneNode(!0), n = enyo.dom.getBounds(e);
return t.style.height = n.height + "px", t.style.width = n.width + "px", t;
},
removePlaceholderNode: function() {
this.removeNode(this.placeholderNode), this.placeholderNode = null;
},
removeDraggingRowNode: function() {
this.draggingRowNode = null;
var e = this.$.holdingarea.hasNode();
e.innerHTML = "";
},
removeNode: function(e) {
if (!e || !e.parentNode) return;
e.parentNode.removeChild(e);
},
updatePageHeight: function(e) {
if (e < 0) return;
var t = this.pageForPageNumber(e, !0);
if (t) {
var n = this.pageHeights[e], r = Math.max(1, t.getBounds().height);
this.pageHeights[e] = r, this.portSize += r - n;
}
},
updatePagePositions: function(e) {
this.positionPage(this.currentPageNumber, this.pageForPageNumber(this.currentPageNumber)), this.positionPage(e, this.pageForPageNumber(e));
},
correctPageHeights: function() {
this.updatePageHeight(this.currentPageNumber), this.initialPageNumber != this.currentPageNumber && this.updatePageHeight(this.initialPageNumber);
},
hideNode: function(e) {
return e.style.display = "none", e;
},
showNode: function(e) {
return e.style.display = "block", e;
},
dropPinnedRow: function(e) {
this.moveReorderedContainerToDroppedPosition(e), this.completeReorderTimeout = setTimeout(enyo.bind(this, this.completeFinishReordering, e), 100);
return;
},
cancelPinnedMode: function(e) {
this.placeholderRowIndex = this.draggingRowIndex, this.dropPinnedRow(e);
},
getRowIndexFromCoordinate: function(e) {
var t = this.getScrollTop() + e - enyo.dom.calcNodePosition(this.hasNode()).top;
if (t < 0) return -1;
var n = this.positionToPageInfo(t), r = n.no == this.p0 ? this.p0RowBounds : this.p1RowBounds;
if (!r) return this.count;
var i = n.pos, s = this.placeholderNode ? enyo.dom.getBounds(this.placeholderNode).height : 0, o = 0;
for (var u = n.startRow; u <= n.endRow; ++u) {
if (u === this.placeholderRowIndex) {
o += s;
if (o >= i) return -1;
}
if (u !== this.draggingRowIndex) {
o += r[u].height;
if (o >= i) return u;
}
}
return u;
},
getIndexPosition: function(e) {
return enyo.dom.calcNodePosition(this.$.generator.fetchRowNode(e));
},
setItemPosition: function(e, t) {
var n = this.getNodeStyle(t), r = this.getStrategyKind() == "ScrollStrategy" ? n.top : n.top - this.getScrollTop(), i = "top:" + r + "px; left:" + n.left + "px;";
e.addStyles(i);
},
setItemBounds: function(e, t) {
var n = this.getNodeStyle(t), r = "width:" + n.w + "px; height:" + n.h + "px;";
e.addStyles(r);
},
reorderScroll: function(e, t) {
this.getStrategyKind() == "ScrollStrategy" && this.$.reorderContainer.addStyles("top:" + (this.initialPinPosition + this.getScrollTop() - this.rowHeight) + "px;"), this.updatePlaceholderPosition(this.initialPinPosition);
},
hideReorderingRow: function() {
var e = this.hasNode().querySelector('[data-enyo-index="' + this.draggingRowIndex + '"]');
e && (this.hiddenNode = this.hideNode(e));
},
isReordering: function() {
return this.draggingRowIndex > -1;
},
isSwiping: function() {
return this.swipeIndex != null && !this.swipeComplete && this.swipeDirection != null;
},
swipeDragStart: function(e, t) {
return t.index == null || t.vertical ? !0 : (this.completeSwipeTimeout && this.completeSwipe(t), this.swipeComplete = !1, this.swipeIndex != t.index && (this.clearSwipeables(), this.swipeIndex = t.index), this.swipeDirection = t.xDirection, this.persistentItemVisible || this.startSwipe(t), this.draggedXDistance = 0, this.draggedYDistance = 0, !0);
},
swipeDrag: function(e, t) {
return this.persistentItemVisible ? (this.dragPersistentItem(t), this.preventDragPropagation) : this.isSwiping() ? (this.dragSwipeableComponents(this.calcNewDragPosition(t.ddx)), this.draggedXDistance = t.dx, this.draggedYDistance = t.dy, !0) : !1;
},
swipeDragFinish: function(e, t) {
if (this.persistentItemVisible) this.dragFinishPersistentItem(t); else {
if (!this.isSwiping()) return !1;
var n = this.calcPercentageDragged(this.draggedXDistance);
n > this.percentageDraggedThreshold && t.xDirection === this.swipeDirection ? this.swipe(this.fastSwipeSpeedMS) : this.backOutSwipe(t);
}
return this.preventDragPropagation;
},
isSwipeable: function() {
return this.enableSwipe && this.$.swipeableComponents.controls.length !== 0 && !this.isReordering() && !this.pinnedReorderMode;
},
positionSwipeableContainer: function(e, t) {
var n = this.$.generator.fetchRowNode(e);
if (!n) return;
var r = this.getRelativeOffset(n, this.hasNode()), i = enyo.dom.getBounds(n), s = t == 1 ? -1 * i.width : i.width;
this.$.swipeableComponents.addStyles("top: " + r.top + "px; left: " + s + "px; height: " + i.height + "px; width: " + i.width + "px;");
},
calcNewDragPosition: function(e) {
var t = this.$.swipeableComponents.getBounds(), n = t.left, r = this.$.swipeableComponents.getBounds(), i = this.swipeDirection == 1 ? 0 : -1 * r.width, s = this.swipeDirection == 1 ? n + e > i ? i : n + e : n + e < i ? i : n + e;
return s;
},
dragSwipeableComponents: function(e) {
this.$.swipeableComponents.applyStyle("left", e + "px");
},
startSwipe: function(e) {
e.index = this.swipeIndex, this.positionSwipeableContainer(this.swipeIndex, e.xDirection), this.$.swipeableComponents.setShowing(!0), this.setPersistentItemOrigin(e.xDirection), this.doSetupSwipeItem(e);
},
dragPersistentItem: function(e) {
var t = 0, n = this.persistentItemOrigin == "right" ? Math.max(t, t + e.dx) : Math.min(t, t + e.dx);
this.$.swipeableComponents.applyStyle("left", n + "px");
},
dragFinishPersistentItem: function(e) {
var t = this.calcPercentageDragged(e.dx) > .2, n = e.dx > 0 ? "right" : e.dx < 0 ? "left" : null;
this.persistentItemOrigin == n ? t ? this.slideAwayItem() : this.bounceItem(e) : this.bounceItem(e);
},
setPersistentItemOrigin: function(e) {
this.persistentItemOrigin = e == 1 ? "left" : "right";
},
calcPercentageDragged: function(e) {
return Math.abs(e / this.$.swipeableComponents.getBounds().width);
},
swipe: function(e) {
this.swipeComplete = !0, this.animateSwipe(0, e);
},
backOutSwipe: function(e) {
var t = this.$.swipeableComponents.getBounds(), n = this.swipeDirection == 1 ? -1 * t.width : t.width;
this.animateSwipe(n, this.fastSwipeSpeedMS), this.swipeDirection = null;
},
bounceItem: function(e) {
var t = this.$.swipeableComponents.getBounds();
t.left != t.width && this.animateSwipe(0, this.normalSwipeSpeedMS);
},
slideAwayItem: function() {
var e = this.$.swipeableComponents, t = e.getBounds().width, n = this.persistentItemOrigin == "left" ? -1 * t : t;
this.animateSwipe(n, this.normalSwipeSpeedMS), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
clearSwipeables: function() {
this.$.swipeableComponents.setShowing(!1), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
completeSwipe: function(e) {
this.completeSwipeTimeout && (clearTimeout(this.completeSwipeTimeout), this.completeSwipeTimeout = null), this.getPersistSwipeableItem() ? this.persistentItemVisible = !0 : (this.$.swipeableComponents.setShowing(!1), this.swipeComplete && this.doSwipeComplete({
index: this.swipeIndex,
xDirection: this.swipeDirection
})), this.swipeIndex = null, this.swipeDirection = null;
},
animateSwipe: function(e, t) {
var n = enyo.now(), r = 0, i = this.$.swipeableComponents, s = parseInt(i.domStyles.left, 10), o = e - s;
this.stopAnimateSwipe();
var u = enyo.bind(this, function() {
var e = enyo.now() - n, r = e / t, a = s + o * Math.min(r, 1);
i.applyStyle("left", a + "px"), this.job = enyo.requestAnimationFrame(u), e / t >= 1 && (this.stopAnimateSwipe(), this.completeSwipeTimeout = setTimeout(enyo.bind(this, function() {
this.completeSwipe();
}), this.completeSwipeDelayMS));
});
this.job = enyo.requestAnimationFrame(u);
},
stopAnimateSwipe: function() {
this.job && (this.job = enyo.cancelRequestAnimationFrame(this.job));
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var e = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, e), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.strategyKind = this.resetStrategyKind(), this.inherited(arguments);
},
resetStrategyKind: function() {
return enyo.platform.android >= 3 ? "TranslateScrollStrategy" : "TouchScrollStrategy";
},
setPully: function(e, t) {
this.pully = t.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scroll: function(e, t) {
var n = this.inherited(arguments);
this.completingPull && this.pully.setShowing(!1);
var r = this.getStrategy().$.scrollMath || this.getStrategy(), i = -1 * this.getScrollTop();
return r.isInOverScroll() && i > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + i + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), i > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && i < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel())), n;
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(-1 * this.getScrollTop() - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0;
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(this.pullHeight), e.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// AroundList.js

enyo.kind({
name: "enyo.AroundList",
kind: "enyo.List",
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "aboveClient"
}, {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "holdingarea",
allowHtml: !0,
classes: "enyo-list-holdingarea"
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "belowClient"
}, {
name: "placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0px;"
} ]
} ],
aboveComponents: null,
initComponents: function() {
this.inherited(arguments), this.aboveComponents && this.$.aboveClient.createComponents(this.aboveComponents, {
owner: this.owner
}), this.belowComponents && this.$.belowClient.createComponents(this.belowComponents, {
owner: this.owner
});
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.aboveHeight = this.$.aboveClient.getBounds().height, this.belowHeight = this.$.belowClient.getBounds().height, this.portSize = this.aboveHeight + this.belowHeight;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e), r = this.bottomUp ? this.belowHeight : this.aboveHeight;
n += r, t.applyStyle(this.pageBound, n + "px");
},
scrollToContentStart: function() {
var e = this.bottomUp ? this.belowHeight : this.aboveHeight;
this.setScrollPosition(e);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var e = this.getInitialStyleValue(this.hasNode(), this.boundary);
e.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return n ? n.getPropertyValue(t) : e && e.currentStyle ? e.currentStyle[t] : "0";
},
updateBounds: function(e, t) {
var n = {};
n[this.boundary] = e, this.setBounds(n, this.unit), this.setInlineStyles(e, t);
},
updateDragScalar: function() {
if (this.unit == "%") {
var e = this.getBounds()[this.dimension];
this.kDragScalar = e ? 100 / e : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var e = this.axis == "h";
this.dragMoveProp = e ? "dx" : "dy", this.shouldDragProp = e ? "horizontal" : "vertical", this.transform = e ? "translateX" : "translateY", this.dimension = e ? "width" : "height", this.boundary = e ? "left" : "top";
},
setInlineStyles: function(e, t) {
var n = {};
this.unitModifier ? (n[this.boundary] = this.percentToPixels(e, this.unitModifier), n[this.dimension] = this.unitModifier, this.setBounds(n)) : (t ? n[this.dimension] = t : n[this.boundary] = e, this.setBounds(n, this.unit));
},
valueChanged: function(e) {
var t = this.value;
this.isOob(t) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(t) : this.clampValue(t)), enyo.platform.android > 2 && (this.value ? (e === 0 || e === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(e) {
var t = this.calcMin(), n = this.calcMax();
return Math.max(t, Math.min(e, n));
},
dampValue: function(e) {
return this.dampBound(this.dampBound(e, this.min, 1), this.max, -1);
},
dampBound: function(e, t, n) {
var r = e;
return r * n < t * n && (r = t + (r - t) / 4), r;
},
percentToPixels: function(e, t) {
return Math.floor(t / 100 * e);
},
pixelsToPercent: function(e) {
var t = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return e / t * 100;
},
shouldDrag: function(e) {
return this.draggable && e[this.shouldDragProp];
},
isOob: function(e) {
return e > this.calcMax() || e < this.calcMin();
},
dragstart: function(e, t) {
if (this.shouldDrag(t)) return t.preventDefault(), this.$.animator.stop(), t.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(e, t) {
if (this.dragging) {
t.preventDefault();
var n = this.canTransform ? t[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(t[this.dragMoveProp]), r = this.drag0 + n, i = n - this.dragd0;
return this.dragd0 = n, i && (t.dragInfo.minimizing = i < 0), this.setValue(r), this.preventDragPropagation;
}
},
dragfinish: function(e, t) {
if (this.dragging) return this.dragging = !1, this.completeDrag(t), t.preventTap(), this.preventDragPropagation;
},
completeDrag: function(e) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(e.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(e, t) {
this.$.animator.play({
startValue: e,
endValue: t,
node: this.hasNode()
});
},
animateTo: function(e) {
this.play(this.value, e);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(e) {
e ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.doAnimateFinish(e), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n._arranger = null;
this.inherited(arguments);
},
arrange: function(e, t) {},
size: function() {},
start: function() {
var e = this.container.fromIndex, t = this.container.toIndex, n = this.container.transitionPoints = [ e ];
if (this.incrementalPoints) {
var r = Math.abs(t - e) - 2, i = e;
while (r >= 0) i += t < e ? -1 : 1, n.push(i), r--;
}
n.push(this.container.toIndex);
},
finish: function() {},
calcArrangementDifference: function(e, t, n, r) {},
canDragEvent: function(e) {
return e[this.canDragProp];
},
calcDragDirection: function(e) {
return e[this.dragDirectionProp];
},
calcDrag: function(e) {
return e[this.dragProp];
},
drag: function(e, t, n, r, i) {
var s = this.measureArrangementDelta(-e, t, n, r, i);
return s;
},
measureArrangementDelta: function(e, t, n, r, i) {
var s = this.calcArrangementDifference(t, n, r, i), o = s ? e / Math.abs(s) : 0;
return o *= this.container.fromIndex > this.container.toIndex ? -1 : 1, o;
},
_arrange: function(e) {
this.containerBounds || this.reflow();
var t = this.getOrderedControls(e);
this.arrange(t, e);
},
arrangeControl: function(e, t) {
e._arranger = enyo.mixin(e._arranger || {}, t);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) {
enyo.dom.accelerate(n, this.accelerated);
if (enyo.platform.safari) {
var r = n.children;
for (var i = 0, s; s = r[i]; i++) enyo.dom.accelerate(s, this.accelerated);
}
}
},
reflow: function() {
var e = this.container.hasNode();
this.containerBounds = e ? {
width: e.clientWidth,
height: e.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var e = this.container.arrangement;
if (e) for (var t = 0, n = this.container.getPanels(), r; r = n[t]; t++) this.flowControl(r, e[t]);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.opacity;
n != null && enyo.Arranger.opacifyControl(e, n);
},
getOrderedControls: function(e) {
var t = Math.floor(e), n = t - this.controlsIndex, r = n > 0, i = this.c$ || [];
for (var s = 0; s < Math.abs(n); s++) r ? i.push(i.shift()) : i.unshift(i.pop());
return this.controlsIndex = t, i;
},
statics: {
positionControl: function(e, t, n) {
var r = n || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android && enyo.platform.ie !== 10) {
var i = t.left, s = t.top;
i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r, enyo.dom.transform(e, {
translateX: i || null,
translateY: s || null
});
} else e.setBounds(t, n);
},
opacifyControl: function(e, t) {
var n = t;
n = n > .99 ? 1 : n < .01 ? 0 : n, enyo.platform.ie < 9 ? e.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + n * 100 + ")") : e.applyStyle("opacity", n);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) s = n === 0 ? 1 : 0, this.arrangeControl(r, {
opacity: s
});
},
start: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.opacifyControl(n, 1), n.showing || n.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
var i = this.container.fromIndex;
t = this.container.toIndex, this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
arrange: function(e, t) {
var n = t.split("."), r = n[0], i = n[1], s = n[2] == "s", o = this.containerBounds.width;
for (var u = 0, a = this.container.getPanels(), f, l; f = a[u]; u++) l = o, i == u && (l = s ? 0 : -o), r == u && (l = s ? o : 0), i == u && i == r && (l = 0), this.arrangeControl(f, {
left: l
});
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s, o, u;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var a;
for (r = 0, s = 0; u = e[r]; r++) o = enyo.dom.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (a = u);
if (a) {
var f = n.width - s;
a.width = f >= 0 ? f : a.width;
}
for (r = 0, i = t.left; u = e[r]; r++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n, r, i, s, o = this.container.getPanels(), u = this.container.clamp(t), a = this.containerBounds.width;
for (n = u, i = 0; s = o[n]; n++) {
i += s.width + s.marginWidth;
if (i > a) break;
}
var f = a - i, l = 0;
if (f > 0) {
var c = u;
for (n = u - 1, r = 0; s = o[n]; n--) {
r += s.width + s.marginWidth;
if (f - r <= 0) {
l = f - r, u = n;
break;
}
}
}
var h, p;
for (n = 0, p = this.containerPadding.left + l; s = o[n]; n++) h = s.width + s.marginWidth, n < u ? this.arrangeControl(s, {
left: -h
}) : (this.arrangeControl(s, {
left: Math.floor(p)
}), p += h);
},
arrangeWrap: function(e, t) {
for (var n = 0, r = this.containerPadding.left, i, s; s = e[n]; n++) this.arrangeControl(s, {
left: r
}), r += s.width + s.marginWidth;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i].left - r[i].left;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
peekWidth: 0,
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
constructor: function() {
this.inherited(arguments), this.peekWidth = this.container.peekWidth != null ? this.container.peekWidth : this.peekWidth;
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o, u = 0; o = n[r]; r++) o.getShowing() ? (this.arrangeControl(o, {
left: i + u * this.peekWidth
}), r >= t && (i += o.width + o.marginWidth - this.peekWidth), u++) : (this.arrangeControl(o, {
left: i
}), r >= t && (i += o.width + o.marginWidth)), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
left: i - t
});
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels().length - 1;
return Math.abs(r[i].left - t[i].left);
},
flowControl: function(e, t) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var n = this.container.getPanels(), r = n.length - 1, i = n[r];
e == i && this.fitControl(e, t.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var e = this.container.getPanels(), t = this.container.arrangement, n = e.length - 1, r = e[n];
this.fitControl(r, t[n].left);
}
},
fitControl: function(e, t) {
e._fit = !0, e.applyStyle("width", this.containerBounds.width - t + "px"), e.resized();
}
});

// DockRightArranger.js

enyo.kind({
name: "enyo.DockRightArranger",
kind: "Arranger",
basePanel: !1,
overlap: 0,
layoutWidth: 0,
constructor: function() {
this.inherited(arguments), this.overlap = this.container.overlap != null ? this.container.overlap : this.overlap, this.layoutWidth = this.container.layoutWidth != null ? this.container.layoutWidth : this.layoutWidth;
},
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s;
n.width -= t.left + t.right;
var o = n.width, u = e.length;
this.container.transitionPositions = {};
for (r = 0; s = e[r]; r++) s.width = r === 0 && this.container.basePanel ? o : s.getBounds().width;
for (r = 0; s = e[r]; r++) {
r === 0 && this.container.basePanel && s.setBounds({
width: o
}), s.setBounds({
top: t.top,
bottom: t.bottom
});
for (j = 0; s = e[j]; j++) {
var a;
if (r === 0 && this.container.basePanel) a = 0; else if (j < r) a = o; else {
if (r !== j) break;
var f = o > this.layoutWidth ? this.overlap : 0;
a = o - e[r].width + f;
}
this.container.transitionPositions[r + "." + j] = a;
}
if (j < u) {
var l = !1;
for (k = r + 1; k < u; k++) {
var f = 0;
if (l) f = 0; else if (e[r].width + e[k].width - this.overlap > o) f = 0, l = !0; else {
f = e[r].width - this.overlap;
for (i = r; i < k; i++) {
var c = f + e[i + 1].width - this.overlap;
if (!(c < o)) {
f = o;
break;
}
f = c;
}
f = o - f;
}
this.container.transitionPositions[r + "." + k] = f;
}
}
}
},
arrange: function(e, t) {
var n, r, i = this.container.getPanels(), s = this.container.clamp(t);
for (n = 0; r = i[n]; n++) {
var o = this.container.transitionPositions[n + "." + s];
this.arrangeControl(r, {
left: o
});
}
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels(), s = e < n ? i[n].width : i[e].width;
return s;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var e = this.container.getPanels(), t = this.containerBounds[this.axisSize], n = t - this.margin - this.margin;
for (var r = 0, i, s; s = e[r]; r++) i = {}, i[this.axisSize] = n, i[this.offAxisSize] = "100%", s.setBounds(i);
},
start: function() {
this.inherited(arguments);
var e = this.container.fromIndex, t = this.container.toIndex, n = this.getOrderedControls(t), r = Math.floor(n.length / 2);
for (var i = 0, s; s = n[i]; i++) e > t ? i == n.length - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1) : i == n.length - 1 - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1);
},
arrange: function(e, t) {
var n, r, i, s;
if (this.container.getPanels().length == 1) {
s = {}, s[this.axisPosition] = this.margin, this.arrangeControl(this.container.getPanels()[0], s);
return;
}
var o = Math.floor(this.container.getPanels().length / 2), u = this.getOrderedControls(Math.floor(t) - o), a = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - a * o;
for (n = 0; r = u[n]; n++) s = {}, s[this.axisPosition] = f, this.arrangeControl(r, s), f += a;
},
calcArrangementDifference: function(e, t, n, r) {
if (this.container.getPanels().length == 1) return 0;
var i = Math.abs(e % this.c$.length);
return t[i][this.axisPosition] - r[i][this.axisPosition];
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(n, 1), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var e = this.container.getPanels(), t = this.containerBounds, n = this.controlWidth = t.width / 3, r = this.controlHeight = t.height / 3;
for (var i = 0, s; s = e[i]; i++) s.setBounds({
width: n,
height: r
});
},
arrange: function(e, t) {
var n = this.inc;
for (var r = 0, i = e.length, s; s = e[r]; r++) {
var o = Math.cos(r / i * 2 * Math.PI) * r * n + this.controlWidth, u = Math.sin(r / i * 2 * Math.PI) * r * n + this.controlHeight;
this.arrangeControl(s, {
left: o,
top: u
});
}
},
start: function() {
this.inherited(arguments);
var e = this.getOrderedControls(this.container.toIndex);
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", e.length - t);
},
calcArrangementDifference: function(e, t, n, r) {
return this.controlWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", null), enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var e = this.container.getPanels(), t = this.colWidth, n = this.colHeight;
for (var r = 0, i; i = e[r]; r++) i.setBounds({
width: t,
height: n
});
},
arrange: function(e, t) {
var n = this.colWidth, r = this.colHeight, i = Math.max(1, Math.floor(this.containerBounds.width / n)), s;
for (var o = 0, u = 0; u < e.length; o++) for (var a = 0; a < i && (s = e[u]); a++, u++) this.arrangeControl(s, {
left: n * a,
top: r * o
});
},
flowControl: function(e, t) {
this.inherited(arguments), enyo.Arranger.opacifyControl(e, t.top % this.colHeight !== 0 ? .25 : 1);
},
calcArrangementDifference: function(e, t, n, r) {
return this.colWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onscroll: "domScroll"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.narrowFitChanged(), this.indexChanged();
},
rendered: function() {
this.inherited(arguments), enyo.makeBubble(this, "scroll");
},
domScroll: function(e, t) {
this.hasNode() && this.node.scrollLeft > 0 && (this.node.scrollLeft = 0);
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
narrowFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
destroy: function() {
this.destroying = !0, this.inherited(arguments);
},
removeControl: function(e) {
this.inherited(arguments), this.destroying && this.controls.length > 0 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var e = this.controlParent || this;
return e.children;
},
getActive: function() {
var e = this.getPanels(), t = this.index % e.length;
return t < 0 && (t += e.length), e[t];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(e) {
this.setPropertyValue("index", e, "indexChanged");
},
setIndexDirect: function(e) {
this.setIndex(e), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(e) {
var t = this.getPanels().length - 1;
return this.wrap ? e : Math.max(0, Math.min(e, t));
},
indexChanged: function(e) {
this.lastIndex = e, this.index = this.clamp(this.index), !this.dragging && this.$.animator && (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(e) {
this.fraction = e.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(e, t) {
if (this.draggable && this.layout && this.layout.canDragEvent(t)) return t.preventDefault(), this.dragstartTransition(t), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(e, t) {
this.dragging && (t.preventDefault(), this.dragTransition(t));
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap(), this.dragfinishTransition(t));
},
dragstartTransition: function(e) {
if (!this.$.animator.isAnimating()) {
var t = this.fromIndex = this.index;
this.toIndex = t - (this.layout ? this.layout.calcDragDirection(e) : 0);
} else this.verifyDragTransition(e);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(e) {
var t = this.layout ? this.layout.calcDrag(e) : 0, n = this.transitionPoints, r = n[0], i = n[n.length - 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i), u = this.layout ? this.layout.drag(t, r, s, i, o) : 0, a = t && !u;
a, this.fraction += u;
var f = this.fraction;
if (f > 1 || f < 0 || a) (f > 0 || a) && this.dragfinishTransition(e), this.dragstartTransition(e), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(e) {
this.verifyDragTransition(e), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(e) {
var t = this.layout ? this.layout.calcDragDirection(e) : 0, n = Math.min(this.fromIndex, this.toIndex), r = Math.max(this.fromIndex, this.toIndex);
if (t > 0) {
var i = n;
n = r, r = i;
}
n != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = n, this.toIndex = r;
},
refresh: function() {
this.$.animator && this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var e = this.startTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.fromIndex || e.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var e = this.finishTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.lastIndex || e.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var e = this.transitionPoints, t = (this.fraction || 0) * (e.length - 1), n = Math.floor(t);
t -= n;
var r = e[n], i = e[n + 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i);
this.arrangement = s && o ? enyo.Panels.lerp(s, o, t) : s || o, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(e) {
return e != null && !this.arrangements[e] && this.layout && (this.layout._arrange(e), this.arrangements[e] = this.readArrangement(this.getPanels())), this.arrangements[e];
},
readArrangement: function(e) {
var t = [];
for (var n = 0, r = e, i; i = r[n]; n++) t.push(enyo.clone(i._arranger));
return t;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(e, t, n) {
var r = [];
for (var i = 0, s = enyo.keys(e), o; o = s[i]; i++) r.push(this.lerpObject(e[o], t[o], n));
return r;
},
lerpObject: function(e, t, n) {
var r = enyo.clone(e), i, s;
if (t) for (var o in e) i = e[o], s = t[o], i != s && (r[o] = i - (i - s) * n);
return r;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// ImageViewPin.js

enyo.kind({
name: "enyo.ImageViewPin",
kind: "enyo.Control",
published: {
highlightAnchorPoint: !1,
anchor: {
top: 0,
left: 0
},
position: {
top: 0,
left: 0
}
},
style: "position:absolute;z-index:1000;width:0px;height:0px;",
handlers: {
onPositionPin: "reAnchor"
},
create: function() {
this.inherited(arguments), this.styleClientControls(), this.positionClientControls(), this.highlightAnchorPointChanged(), this.anchorChanged();
},
styleClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) e[t].applyStyle("position", "absolute");
},
positionClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) for (var n in this.position) e[t].applyStyle(n, this.position[n] + "px");
},
highlightAnchorPointChanged: function() {
this.addRemoveClass("pinDebug", this.highlightAnchorPoint);
},
anchorChanged: function() {
var e = null, t = null;
for (t in this.anchor) {
e = this.anchor[t].toString().match(/^(\d+(?:\.\d+)?)(.*)$/);
if (!e) continue;
this.anchor[t + "Coords"] = {
value: e[1],
units: e[2] || "px"
};
}
},
reAnchor: function(e, t) {
var n = t.scale, r = t.bounds, i = this.anchor.right ? this.anchor.rightCoords.units == "px" ? r.width + r.x - this.anchor.rightCoords.value * n : r.width * (100 - this.anchor.rightCoords.value) / 100 + r.x : this.anchor.leftCoords.units == "px" ? this.anchor.leftCoords.value * n + r.x : r.width * this.anchor.leftCoords.value / 100 + r.x, s = this.anchor.bottom ? this.anchor.bottomCoords.units == "px" ? r.height + r.y - this.anchor.bottomCoords.value * n : r.height * (100 - this.anchor.bottomCoords.value) / 100 + r.y : this.anchor.topCoords.units == "px" ? this.anchor.topCoords.value * n + r.y : r.height * this.anchor.topCoords.value / 100 + r.y;
this.applyStyle("left", i + "px"), this.applyStyle("top", s + "px");
}
});

// ImageView.js

enyo.kind({
name: "enyo.ImageView",
kind: enyo.Scroller,
touchOverscroll: !1,
thumb: !1,
animate: !0,
verticalDragPropagation: !0,
horizontalDragPropagation: !0,
published: {
scale: "auto",
disableZoom: !1,
src: undefined
},
events: {
onZoom: ""
},
touch: !0,
preventDragPropagation: !1,
handlers: {
ondragstart: "dragPropagation"
},
components: [ {
name: "animator",
kind: "Animator",
onStep: "zoomAnimationStep",
onEnd: "zoomAnimationEnd"
}, {
name: "viewport",
style: "overflow:hidden;min-height:100%;min-width:100%;",
classes: "enyo-fit",
ongesturechange: "gestureTransform",
ongestureend: "saveState",
ontap: "singleTap",
ondblclick: "doubleClick",
onmousewheel: "mousewheel",
components: [ {
kind: "Image",
ondown: "down"
} ]
} ],
create: function() {
this.inherited(arguments), this.canTransform = enyo.dom.canTransform(), this.canTransform || this.$.image.applyStyle("position", "relative"), this.canAccelerate = enyo.dom.canAccelerate(), this.bufferImage = new Image, this.bufferImage.onload = enyo.bind(this, "imageLoaded"), this.bufferImage.onerror = enyo.bind(this, "imageError"), this.srcChanged(), this.getStrategy().setDragDuringGesture(!1), this.getStrategy().$.scrollMath && this.getStrategy().$.scrollMath.start();
},
down: function(e, t) {
t.preventDefault();
},
dragPropagation: function(e, t) {
var n = this.getStrategy().getScrollBounds(), r = n.top === 0 && t.dy > 0 || n.top >= n.maxTop - 2 && t.dy < 0, i = n.left === 0 && t.dx > 0 || n.left >= n.maxLeft - 2 && t.dx < 0;
return !(r && this.verticalDragPropagation || i && this.horizontalDragPropagation);
},
mousewheel: function(e, t) {
t.pageX |= t.clientX + t.target.scrollLeft, t.pageY |= t.clientY + t.target.scrollTop;
var n = (this.maxScale - this.minScale) / 10, r = this.scale;
if (t.wheelDelta > 0 || t.detail < 0) this.scale = this.limitScale(this.scale + n); else if (t.wheelDelta < 0 || t.detail > 0) this.scale = this.limitScale(this.scale - n);
return this.eventPt = this.calcEventLocation(t), this.transformImage(this.scale), r != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null, t.preventDefault(), !0;
},
srcChanged: function() {
this.src && this.src.length > 0 && this.bufferImage && this.src != this.bufferImage.src && (this.bufferImage.src = this.src);
},
imageLoaded: function(e) {
this.originalWidth = this.bufferImage.width, this.originalHeight = this.bufferImage.height, this.scaleChanged(), this.$.image.setSrc(this.bufferImage.src), enyo.dom.transformValue(this.getStrategy().$.client, "translate3d", "0px, 0px, 0"), this.positionClientControls(this.scale), this.alignImage();
},
resizeHandler: function() {
this.inherited(arguments), this.$.image.src && this.scaleChanged();
},
scaleChanged: function() {
var e = this.hasNode();
if (e) {
this.containerWidth = e.clientWidth, this.containerHeight = e.clientHeight;
var t = this.containerWidth / this.originalWidth, n = this.containerHeight / this.originalHeight;
this.minScale = Math.min(t, n), this.maxScale = this.minScale * 3 < 1 ? 1 : this.minScale * 3, this.scale == "auto" ? this.scale = this.minScale : this.scale == "width" ? this.scale = t : this.scale == "height" ? this.scale = n : this.scale == "fit" ? (this.fitAlignment = "center", this.scale = Math.max(t, n)) : (this.maxScale = Math.max(this.maxScale, this.scale), this.scale = this.limitScale(this.scale));
}
this.eventPt = this.calcEventLocation(), this.transformImage(this.scale);
},
imageError: function(e) {
enyo.error("Error loading image: " + this.src), this.bubble("onerror", e);
},
alignImage: function() {
if (this.fitAlignment && this.fitAlignment === "center") {
var e = this.getScrollBounds();
this.setScrollLeft(e.maxLeft / 2), this.setScrollTop(e.maxTop / 2);
}
},
gestureTransform: function(e, t) {
this.eventPt = this.calcEventLocation(t), this.transformImage(this.limitScale(this.scale * t.scale));
},
calcEventLocation: function(e) {
var t = {
x: 0,
y: 0
};
if (e && this.hasNode()) {
var n = this.node.getBoundingClientRect();
t.x = Math.round(e.pageX - n.left - this.imageBounds.x), t.x = Math.max(0, Math.min(this.imageBounds.width, t.x)), t.y = Math.round(e.pageY - n.top - this.imageBounds.y), t.y = Math.max(0, Math.min(this.imageBounds.height, t.y));
}
return t;
},
transformImage: function(e) {
this.tapped = !1;
var t = this.imageBounds || this.innerImageBounds(e);
this.imageBounds = this.innerImageBounds(e), this.scale > this.minScale ? this.$.viewport.applyStyle("cursor", "move") : this.$.viewport.applyStyle("cursor", null), this.$.viewport.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px"
}), this.ratioX = this.ratioX || (this.eventPt.x + this.getScrollLeft()) / t.width, this.ratioY = this.ratioY || (this.eventPt.y + this.getScrollTop()) / t.height;
var n, r;
this.$.animator.ratioLock ? (n = this.$.animator.ratioLock.x * this.imageBounds.width - this.containerWidth / 2, r = this.$.animator.ratioLock.y * this.imageBounds.height - this.containerHeight / 2) : (n = this.ratioX * this.imageBounds.width - this.eventPt.x, r = this.ratioY * this.imageBounds.height - this.eventPt.y), n = Math.max(0, Math.min(this.imageBounds.width - this.containerWidth, n)), r = Math.max(0, Math.min(this.imageBounds.height - this.containerHeight, r));
if (this.canTransform) {
var i = {
scale: e
};
this.canAccelerate ? i = enyo.mixin({
translate3d: Math.round(this.imageBounds.left) + "px, " + Math.round(this.imageBounds.top) + "px, 0px"
}, i) : i = enyo.mixin({
translate: this.imageBounds.left + "px, " + this.imageBounds.top + "px"
}, i), enyo.dom.transform(this.$.image, i);
} else this.$.image.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px",
left: this.imageBounds.left + "px",
top: this.imageBounds.top + "px"
});
this.setScrollLeft(n), this.setScrollTop(r), this.positionClientControls(e);
},
limitScale: function(e) {
return this.disableZoom ? e = this.scale : e > this.maxScale ? e = this.maxScale : e < this.minScale && (e = this.minScale), e;
},
innerImageBounds: function(e) {
var t = this.originalWidth * e, n = this.originalHeight * e, r = {
x: 0,
y: 0,
transX: 0,
transY: 0
};
return t < this.containerWidth && (r.x += (this.containerWidth - t) / 2), n < this.containerHeight && (r.y += (this.containerHeight - n) / 2), this.canTransform && (r.transX -= (this.originalWidth - t) / 2, r.transY -= (this.originalHeight - n) / 2), {
left: r.x + r.transX,
top: r.y + r.transY,
width: t,
height: n,
x: r.x,
y: r.y
};
},
saveState: function(e, t) {
var n = this.scale;
this.scale *= t.scale, this.scale = this.limitScale(this.scale), n != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null;
},
doubleClick: function(e, t) {
enyo.platform.ie == 8 && (this.tapped = !0, t.pageX = t.clientX + t.target.scrollLeft, t.pageY = t.clientY + t.target.scrollTop, this.singleTap(e, t), t.preventDefault());
},
singleTap: function(e, t) {
setTimeout(enyo.bind(this, function() {
this.tapped = !1;
}), 300), this.tapped ? (this.tapped = !1, this.smartZoom(e, t)) : this.tapped = !0;
},
smartZoom: function(e, t) {
var n = this.hasNode(), r = this.$.image.hasNode();
if (n && r && this.hasNode() && !this.disableZoom) {
var i = this.scale;
this.scale != this.minScale ? this.scale = this.minScale : this.scale = this.maxScale, this.eventPt = this.calcEventLocation(t);
if (this.animate) {
var s = {
x: (this.eventPt.x + this.getScrollLeft()) / this.imageBounds.width,
y: (this.eventPt.y + this.getScrollTop()) / this.imageBounds.height
};
this.$.animator.play({
duration: 350,
ratioLock: s,
baseScale: i,
deltaScale: this.scale - i
});
} else this.transformImage(this.scale), this.doZoom({
scale: this.scale
});
}
},
zoomAnimationStep: function(e, t) {
var n = this.$.animator.baseScale + this.$.animator.deltaScale * this.$.animator.value;
this.transformImage(n);
},
zoomAnimationEnd: function(e, t) {
this.doZoom({
scale: this.scale
}), this.$.animator.ratioLock = undefined;
},
positionClientControls: function(e) {
this.waterfallDown("onPositionPin", {
scale: e,
bounds: this.imageBounds
});
}
});

// ImageCarousel.js

enyo.kind({
name: "enyo.ImageCarousel",
kind: enyo.Panels,
arrangerKind: "enyo.CarouselArranger",
defaultScale: "auto",
disableZoom: !1,
lowMemory: !1,
published: {
images: []
},
handlers: {
onTransitionStart: "transitionStart",
onTransitionFinish: "transitionFinish"
},
create: function() {
this.inherited(arguments), this.imageCount = this.images.length, this.images.length > 0 && (this.initContainers(), this.loadNearby());
},
initContainers: function() {
for (var e = 0; e < this.images.length; e++) this.$["container" + e] || (this.createComponent({
name: "container" + e,
style: "height:100%; width:100%;"
}), this.$["container" + e].render());
for (e = this.images.length; e < this.imageCount; e++) this.$["image" + e] && this.$["image" + e].destroy(), this.$["container" + e].destroy();
this.imageCount = this.images.length;
},
loadNearby: function() {
var e = this.getBufferRange();
for (var t in e) this.loadImageView(e[t]);
},
getBufferRange: function() {
var e = [];
if (this.layout.containerBounds) {
var t = 1, n = this.layout.containerBounds, r, i, s, o, u, a;
o = this.index - 1, u = 0, a = n.width * t;
while (o >= 0 && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.unshift(o), o--;
o = this.index, u = 0, a = n.width * (t + 1);
while (o < this.images.length && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.push(o), o++;
}
return e;
},
reflow: function() {
this.inherited(arguments), this.loadNearby();
},
loadImageView: function(e) {
return this.wrap && (e = (e % this.images.length + this.images.length) % this.images.length), e >= 0 && e <= this.images.length - 1 && (this.$["image" + e] ? this.$["image" + e].src != this.images[e] && (this.$["image" + e].setSrc(this.images[e]), this.$["image" + e].setScale(this.defaultScale), this.$["image" + e].setDisableZoom(this.disableZoom)) : (this.$["container" + e].createComponent({
name: "image" + e,
kind: "ImageView",
scale: this.defaultScale,
disableZoom: this.disableZoom,
src: this.images[e],
verticalDragPropagation: !1,
style: "height:100%; width:100%;"
}, {
owner: this
}), this.$["image" + e].render())), this.$["image" + e];
},
setImages: function(e) {
this.setPropertyValue("images", e, "imagesChanged");
},
imagesChanged: function() {
this.initContainers(), this.loadNearby();
},
indexChanged: function() {
this.loadNearby(), this.lowMemory && this.cleanupMemory(), this.inherited(arguments);
},
transitionStart: function(e, t) {
if (t.fromIndex == t.toIndex) return !0;
},
transitionFinish: function(e, t) {
this.loadNearby(), this.lowMemory && this.cleanupMemory();
},
getActiveImage: function() {
return this.getImageByIndex(this.index);
},
getImageByIndex: function(e) {
return this.$["image" + e] || this.loadImageView(e);
},
cleanupMemory: function() {
var e = getBufferRange();
for (var t = 0; t < this.images.length; t++) enyo.indexOf(t, e) === -1 && this.$["image" + t] && this.$["image" + t].destroy();
}
});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: "",
disabled: !1
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged();
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable",
create: function() {
enyo.platform.firefoxOS && (this.handlers.ondown = "down", this.handlers.onleave = "leave"), this.inherited(arguments);
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
}
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
create: function() {
enyo.platform.firefoxOS && (this.handlers.ondown = "down", this.handlers.onleave = "leave"), this.inherited(arguments);
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
},
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
if (this.disabled) return !0;
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
onclick: ""
},
tap: function(e, t) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !this.disabled;
},
dragstart: function() {}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v",
animated: !0
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.animatedChanged(), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
animatedChanged: function() {
!this.animated && this.hasNode() && this.$.animator.isAnimating() && (this.$.animator.stop(), this.animatorEnd());
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) if (this.$.animator.isAnimating()) this.$.animator.reverse(); else {
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left";
this.applyStyle(t, null);
var r = this.hasNode()[e ? "scrollHeight" : "scrollWidth"];
this.animated ? this.$.animator.play({
startValue: this.open ? 0 : r,
endValue: this.open ? r : 0,
dimension: t,
position: n
}) : this.animatorEnd();
} else this.$.client.setShowing(this.open);
},
animatorStep: function(e) {
if (this.hasNode()) {
var t = e.dimension;
this.node.style[t] = this.domStyles[t] = e.value + "px";
}
var n = this.$.client.hasNode();
if (n) {
var r = e.position, i = this.open ? e.endValue : e.startValue;
n.style[r] = this.$.client.domStyles[r] = e.value - i + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
if (!this.open) this.$.client.hide(); else {
this.$.client.domCssText = enyo.Control.domStylesToCssText(this.$.client.domStyles);
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left", r = this.$.client.hasNode();
r && (r.style[n] = this.$.client.domStyles[n] = null), this.node && (this.node.style[t] = this.domStyles[t] = null);
}
this.container && this.container.resized();
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup",
published: {
scrimWhenModal: !0,
scrim: !1,
scrimClassName: ""
},
statics: {
count: 0
},
defaultZ: 120,
showingChanged: function() {
this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, this.showHideScrim(this.showing), this.inherited(arguments);
},
showHideScrim: function(e) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var t = this.getScrim();
if (e) {
var n = this.getScrimZIndex();
this._scrimZ = n, t.showAtZIndex(n);
} else t.hideAtZIndex(this._scrimZ);
enyo.call(t, "addRemoveClass", [ this.scrimClassName, t.showing ]);
}
},
getScrimZIndex: function() {
return this.findZIndex() - 1;
},
getScrim: function() {
return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
},
applyZIndex: function() {
this._zIndex = onyx.Popup.count * 2 + this.findZIndex() + 1, this.applyStyle("z-index", this._zIndex);
},
findZIndex: function() {
var e = this.defaultZ;
return this._zIndex ? e = this._zIndex : this.hasNode() && (e = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || e), this._zIndex = e;
}
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
published: {
alwaysLooksFocused: !1
},
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
create: function() {
this.inherited(arguments), this.updateFocus(!1);
},
alwaysLooksFocusedChanged: function(e) {
this.updateFocus(this.focus);
},
updateFocus: function(e) {
this.focused = e, this.addRemoveClass("onyx-focused", this.alwaysLooksFocused || this.focused);
},
receiveFocus: function() {
this.updateFocus(!0);
},
receiveBlur: function() {
this.updateFocus(!1);
},
disabledChange: function(e, t) {
this.addRemoveClass("onyx-disabled", t.originator.disabled);
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(e, t) {
this.requestHideTooltip(), t.originator.active && (this.menuActive = !0, this.activator = t.originator, this.activator.addClass("active"), this.requestShowMenu());
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(e) {
this.menuActive || this.inherited(arguments);
},
leave: function(e, t) {
this.menuActive || this.inherited(arguments);
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
published: {
maxHeight: 200,
scrolling: !0
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
childComponents: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
showOnTop: !1,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
initComponents: function() {
this.scrolling && this.createComponents(this.childComponents, {
isChrome: !0
}), this.inherited(arguments);
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition(!0);
},
requestMenuShow: function(e, t) {
if (this.floating) {
var n = t.activator.hasNode();
if (n) {
var r = this.activatorOffset = this.getPageOffset(n);
this.applyPosition({
top: r.top + (this.showOnTop ? 0 : r.height),
left: r.left,
width: r.width
});
}
}
return this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = e.getBoundingClientRect(), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.scrolling && !this.showOnTop && this.getScroller().setMaxHeight(this.maxHeight + "px"), this.removeClass("onyx-menu-up"), this.floating || this.applyPosition({
left: "auto"
});
var e = this.node.getBoundingClientRect(), t = e.height === undefined ? e.bottom - e.top : e.height, n = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, r = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = e.top + t > n && n - e.bottom < e.top - t, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var i = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: i.top - t + (this.showOnTop ? i.height : 0),
bottom: "auto"
}) : e.top < i.top && i.top + (this.showOnTop ? 0 : i.height) + t < n && this.applyPosition({
top: i.top + (this.showOnTop ? 0 : i.height),
bottom: "auto"
});
}
e.right > r && (this.floating ? this.applyPosition({
left: r - e.width
}) : this.applyPosition({
left: -(e.right - r)
})), e.left < 0 && (this.floating ? this.applyPosition({
left: 0,
right: "auto"
}) : this.getComputedStyleValue("right") == "auto" ? this.applyPosition({
left: -e.left
}) : this.applyPosition({
right: e.left
}));
if (this.scrolling && !this.showOnTop) {
e = this.node.getBoundingClientRect();
var s;
this.menuUp ? s = this.maxHeight < e.bottom ? this.maxHeight : e.bottom : s = e.top + this.maxHeight < n ? this.maxHeight : n - e.top, this.getScroller().setMaxHeight(s + "px");
}
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
events: {
onSelect: "",
onItemContentChange: ""
},
classes: "onyx-menu-item",
tag: "div",
create: function() {
this.inherited(arguments), this.active && this.bubble("onActivate");
},
tap: function(e) {
this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
selected: this,
content: this.content
});
},
contentChanged: function(e) {
this.inherited(arguments), this.doItemContentChange({
content: this.content
});
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.waterfallDown("onChange", t);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(e, t) {
t.content !== undefined && this.setContent(t.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null
},
events: {
onChange: ""
},
handlers: {
onItemContentChange: "itemContentChange"
},
floating: !0,
showOnTop: !0,
initComponents: function() {
this.setScrolling(!0), this.inherited(arguments);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(e, t) {
return this.processActivatedItem(t.originator), this.inherited(arguments);
},
processActivatedItem: function(e) {
e.active && this.setSelected(e);
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
itemContentChange: function(e, t) {
t.originator == this.selected && this.doChange({
selected: this.selected,
content: this.selected.content
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: "",
onSelect: ""
},
handlers: {
onSelect: "itemSelect"
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "flyweight",
kind: "FlyweightRepeater",
noSelect: !0,
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
initComponents: function() {
this.controlParentName = "flyweight", this.inherited(arguments), this.$.flyweight.$.client.children[0].setActive(!0);
},
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var e = this.$.flyweight.fetchRowNode(this.selected);
this.getScroller().scrollToNode(e, !this.menuUp);
},
countChanged: function() {
this.$.flyweight.count = this.count;
},
processActivatedItem: function(e) {
this.item = e;
},
selectedChanged: function(e) {
if (!this.item) return;
e != null && (this.item.removeClass("selected"), this.$.flyweight.renderRow(e));
var t;
this.selected != null && (this.item.addClass("selected"), this.$.flyweight.renderRow(this.selected), this.item.removeClass("selected"), t = this.$.flyweight.fetchRowNode(this.selected)), this.doChange({
selected: this.selected,
content: t && t.textContent || this.item.content
});
},
itemTap: function(e, t) {
this.setSelected(t.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(e, t) {
if (t.originator != this) return !0;
}
});

// DatePicker.js

enyo.kind({
name: "onyx.DatePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
dayHidden: !1,
monthHidden: !1,
yearHidden: !1,
minYear: 1900,
maxYear: 2099,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getMonthFields()), this.setupPickers(this._tf ? this._tf.getDateFieldOrder() : "mdy"), this.dayHiddenChanged(), this.monthHiddenChanged(), this.yearHiddenChanged();
var t = this.value = this.value || new Date;
for (var n = 0, r; r = e[n]; n++) this.$.monthPicker.createComponent({
content: r,
value: n,
active: n == t.getMonth()
});
var i = t.getFullYear();
this.$.yearPicker.setSelected(i - this.minYear);
for (n = 1; n <= this.monthLength(t.getYear(), t.getMonth()); n++) this.$.dayPicker.createComponent({
content: n,
value: n,
active: n == t.getDate()
});
},
monthLength: function(e, t) {
return 32 - (new Date(e, t, 32)).getDate();
},
setupYear: function(e, t) {
this.$.year.setContent(this.minYear + t.index);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "d":
this.createDay();
break;
case "m":
this.createMonth();
break;
case "y":
this.createYear();
break;
default:
}
}
},
createYear: function() {
var e = this.maxYear - this.minYear;
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateYear",
components: [ {
classes: "onyx-datepicker-year",
name: "yearPickerButton",
disabled: this.disabled
}, {
name: "yearPicker",
kind: "onyx.FlyweightPicker",
count: ++e,
onSetupItem: "setupYear",
components: [ {
name: "year"
} ]
} ]
});
},
createMonth: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMonth",
components: [ {
classes: "onyx-datepicker-month",
name: "monthPickerButton",
disabled: this.disabled
}, {
name: "monthPicker",
kind: "onyx.Picker"
} ]
});
},
createDay: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateDay",
components: [ {
classes: "onyx-datepicker-day",
name: "dayPickerButton",
disabled: this.disabled
}, {
name: "dayPicker",
kind: "onyx.Picker"
} ]
});
},
localeChanged: function() {
this.refresh();
},
dayHiddenChanged: function() {
this.$.dayPicker.getParent().setShowing(this.dayHidden ? !1 : !0);
},
monthHiddenChanged: function() {
this.$.monthPicker.getParent().setShowing(this.monthHidden ? !1 : !0);
},
yearHiddenChanged: function() {
this.$.yearPicker.getParent().setShowing(this.yearHidden ? !1 : !0);
},
minYearChanged: function() {
this.refresh();
},
maxYearChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
disabledChanged: function() {
this.$.yearPickerButton.setDisabled(this.disabled), this.$.monthPickerButton.setDisabled(this.disabled), this.$.dayPickerButton.setDisabled(this.disabled);
},
updateDay: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), this.value.getMonth(), t.selected.value);
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateMonth: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), t.selected.value, this.value.getDate());
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateYear: function(e, t) {
if (t.originator.selected != -1) {
var n = this.calcDate(this.minYear + t.originator.selected, this.value.getMonth(), this.value.getDate());
this.doSelect({
name: this.name,
value: n
}), this.setValue(n);
}
return !0;
},
calcDate: function(e, t, n) {
return new Date(e, t, n, this.value.getHours(), this.value.getMinutes(), this.value.getSeconds(), this.value.getMilliseconds());
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// TimePicker.js

enyo.kind({
name: "onyx.TimePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
is24HrMode: null,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = "AM", t = "PM";
this.is24HrMode == null && (this.is24HrMode = !1), enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getAmCaption(), t = this._tf.getPmCaption(), this.is24HrMode == null && (this.is24HrMode = !this._tf.isAmPm())), this.setupPickers(this._tf ? this._tf.getTimeFieldOrder() : "hma");
var n = this.value = this.value || new Date, r;
if (!this.is24HrMode) {
var i = n.getHours();
i = i === 0 ? 12 : i;
for (r = 1; r <= 12; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == (i > 12 ? i % 12 : i)
});
} else for (r = 0; r < 24; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == n.getHours()
});
for (r = 0; r <= 59; r++) this.$.minutePicker.createComponent({
content: r < 10 ? "0" + r : r,
value: r,
active: r == n.getMinutes()
});
n.getHours() >= 12 ? this.$.ampmPicker.createComponents([ {
content: e
}, {
content: t,
active: !0
} ]) : this.$.ampmPicker.createComponents([ {
content: e,
active: !0
}, {
content: t
} ]), this.$.ampmPicker.getParent().setShowing(!this.is24HrMode);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "h":
this.createHour();
break;
case "m":
this.createMinute();
break;
case "a":
this.createAmPm();
break;
default:
}
}
},
createHour: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateHour",
components: [ {
classes: "onyx-timepicker-hour",
name: "hourPickerButton",
disabled: this.disabled
}, {
name: "hourPicker",
kind: "onyx.Picker"
} ]
});
},
createMinute: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMinute",
components: [ {
classes: "onyx-timepicker-minute",
name: "minutePickerButton",
disabled: this.disabled
}, {
name: "minutePicker",
kind: "onyx.Picker"
} ]
});
},
createAmPm: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateAmPm",
components: [ {
classes: "onyx-timepicker-ampm",
name: "ampmPickerButton",
disabled: this.disabled
}, {
name: "ampmPicker",
kind: "onyx.Picker"
} ]
});
},
disabledChanged: function() {
this.$.hourPickerButton.setDisabled(this.disabled), this.$.minutePickerButton.setDisabled(this.disabled), this.$.ampmPickerButton.setDisabled(this.disabled);
},
localeChanged: function() {
this.is24HrMode = null, this.refresh();
},
is24HrModeChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
updateHour: function(e, t) {
var n = t.selected.value;
if (!this.is24HrMode) {
var r = this.$.ampmPicker.getParent().controlAtIndex(0).content;
n = n + (n == 12 ? -12 : 0) + (this.isAm(r) ? 0 : 12);
}
return this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateMinute: function(e, t) {
return this.value = this.calcTime(this.value.getHours(), t.selected.value), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateAmPm: function(e, t) {
var n = this.value.getHours();
return this.is24HrMode || (n += n > 11 ? this.isAm(t.content) ? -12 : 0 : this.isAm(t.content) ? 0 : 12), this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
calcTime: function(e, t) {
return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), e, t, this.value.getSeconds(), this.value.getMilliseconds());
},
isAm: function(e) {
var t, n, r;
try {
t = this._tf.getAmCaption(), n = this._tf.getPmCaption();
} catch (i) {
t = "AM", n = "PM";
}
return e == t ? !0 : !1;
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
defaultKind: "onyx.RadioButton",
highlander: !0
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.updateVisualState();
},
updateVisualState: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
},
valueChanged: function() {
this.updateVisualState(), this.doChange({
value: this.value
});
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(e) {
this.disabled || this.setValue(e);
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = t.dx;
return Math.abs(n) > 10 && (this.updateValue(n > 0), this.dragged = !0), !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, this.dragged && t.preventTap();
}
});

// ToggleIconButton.js

enyo.kind({
name: "onyx.ToggleIconButton",
kind: "onyx.Icon",
published: {
active: !1,
value: !1
},
events: {
onChange: ""
},
classes: "onyx-icon-button onyx-icon-toggle",
activeChanged: function() {
this.addRemoveClass("active", this.value), this.bubble("onActivate");
},
updateValue: function(e) {
this.disabled || (this.setValue(e), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
valueChanged: function() {
this.setActive(this.value);
},
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active);
},
rendered: function() {
this.inherited(arguments), this.valueChanged(), this.removeClass("onyx-icon");
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
create: function() {
this.inherited(arguments), this.hasClass("onyx-menu-toolbar") && enyo.platform.android >= 4 && this.applyStyle("position", "static");
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0,
increment: 0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(e) {
this.$.bar.removeClass(e), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var e = this.calcPercent(this.progress);
this.updateBarPosition(e);
},
calcIncrement: function(e) {
return Math.round(e / this.increment) * this.increment;
},
clampValue: function(e, t, n) {
return Math.max(e, Math.min(n, t));
},
calcRatio: function(e) {
return (e - this.min) / (this.max - this.min);
},
calcPercent: function(e) {
return this.calcRatio(e) * 100;
},
updateBarPosition: function(e) {
this.$.bar.applyStyle("width", e + "%");
},
animateProgressTo: function(e) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: e,
node: this.hasNode()
});
},
progressAnimatorStep: function(e) {
return this.setProgress(e.value), !0;
},
progressAnimatorComplete: function(e) {
return this.doAnimateProgressFinish(e), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
addZIndex: function(e) {
enyo.indexOf(e, this.zStack) < 0 && this.zStack.push(e);
},
removeZIndex: function(e) {
enyo.remove(e, this.zStack);
},
showAtZIndex: function(e) {
this.addZIndex(e), e !== undefined && this.setZIndex(e), this.show();
},
hideAtZIndex: function(e) {
this.removeZIndex(e);
if (!this.zStack.length) this.hide(); else {
var t = this.zStack[this.zStack.length - 1];
this.setZIndex(t);
}
},
setZIndex: function(e) {
this.zIndex = e, this.applyStyle("z-index", e);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(e, t) {
this.instanceName = e, enyo.setObject(this.instanceName, this), this.props = t || {};
},
make: function() {
var e = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, e), e;
},
showAtZIndex: function(e) {
var t = this.make();
t.showAtZIndex(e);
},
hideAtZIndex: enyo.nop,
show: function() {
var e = this.make();
e.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), enyo.platform.firefoxOS && (this.moreComponents[2].ondown = "down", this.moreComponents[2].onleave = "leave"), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var e = this.calcPercent(this.value);
this.updateKnobPosition(e), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(e) {
this.$.knob.applyStyle("left", e + "%");
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.setValue(n), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(e, t) {
return this.dragging = !1, t.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(e, t) {
if (this.tappable) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.tapped = !0, this.animateTo(n), !0;
}
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
},
animateTo: function(e) {
this.$.animator.play({
startValue: this.value,
endValue: e,
node: this.hasNode()
});
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(e), !0;
}
});

// RangeSlider.js

enyo.kind({
name: "onyx.RangeSlider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
rangeMin: 0,
rangeMax: 100,
rangeStart: 0,
rangeEnd: 100,
beginValue: 0,
endValue: 0
},
events: {
onChange: "",
onChanging: ""
},
showStripes: !1,
showLabels: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
ondown: "down"
},
moreComponents: [ {
name: "startKnob",
classes: "onyx-slider-knob"
}, {
name: "endKnob",
classes: "onyx-slider-knob onyx-range-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.initControls();
},
rendered: function() {
this.inherited(arguments);
var e = this.calcPercent(this.beginValue);
this.updateBarPosition(e);
},
initControls: function() {
this.$.bar.applyStyle("position", "relative"), this.refreshRangeSlider(), this.showLabels && (this.$.startKnob.createComponent({
name: "startLabel",
kind: "onyx.RangeSliderKnobLabel"
}), this.$.endKnob.createComponent({
name: "endLabel",
kind: "onyx.RangeSliderKnobLabel"
}));
},
refreshRangeSlider: function() {
this.beginValue = this.calcKnobPercent(this.rangeStart), this.endValue = this.calcKnobPercent(this.rangeEnd), this.beginValueChanged(), this.endValueChanged();
},
calcKnobRatio: function(e) {
return (e - this.rangeMin) / (this.rangeMax - this.rangeMin);
},
calcKnobPercent: function(e) {
return this.calcKnobRatio(e) * 100;
},
beginValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.beginValue);
this.updateKnobPosition(t, this.$.startKnob);
}
},
endValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.endValue);
this.updateKnobPosition(t, this.$.endKnob);
}
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
updateKnobPosition: function(e, t) {
t.applyStyle("left", e + "%"), this.updateBarPosition();
},
updateBarPosition: function() {
if (this.$.startKnob !== undefined && this.$.endKnob !== undefined) {
var e = this.calcKnobPercent(this.rangeStart), t = this.calcKnobPercent(this.rangeEnd) - e;
this.$.bar.applyStyle("left", e + "%"), this.$.bar.applyStyle("width", t + "%");
}
},
calcRangeRatio: function(e) {
return e / 100 * (this.rangeMax - this.rangeMin) + this.rangeMin - this.increment / 2;
},
swapZIndex: function(e) {
e === "startKnob" ? (this.$.startKnob.applyStyle("z-index", 1), this.$.endKnob.applyStyle("z-index", 0)) : e === "endKnob" && (this.$.startKnob.applyStyle("z-index", 0), this.$.endKnob.applyStyle("z-index", 1));
},
down: function(e, t) {
this.swapZIndex(e.name);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t), r, i, s;
if (e.name === "startKnob" && n >= 0) {
if (!(n <= this.endValue && t.xDirection === -1 || n <= this.endValue)) return this.drag(this.$.endKnob, t);
this.setBeginValue(n), r = this.calcRangeRatio(this.beginValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.startKnob), this.setRangeStart(i), this.doChanging({
value: i
});
} else if (e.name === "endKnob" && n <= 100) {
if (!(n >= this.beginValue && t.xDirection === 1 || n >= this.beginValue)) return this.drag(this.$.startKnob, t);
this.setEndValue(n), r = this.calcRangeRatio(this.endValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.endKnob), this.setRangeEnd(i), this.doChanging({
value: i
});
}
return !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, t.preventTap();
var n;
return e.name === "startKnob" ? (n = this.calcRangeRatio(this.beginValue), this.doChange({
value: n,
startChanged: !0
})) : e.name === "endKnob" && (n = this.calcRangeRatio(this.endValue), this.doChange({
value: n,
startChanged: !1
})), !0;
},
rangeMinChanged: function() {
this.refreshRangeSlider();
},
rangeMaxChanged: function() {
this.refreshRangeSlider();
},
rangeStartChanged: function() {
this.refreshRangeSlider();
},
rangeEndChanged: function() {
this.refreshRangeSlider();
},
setStartLabel: function(e) {
this.$.startKnob.waterfallDown("onSetLabel", e);
},
setEndLabel: function(e) {
this.$.endKnob.waterfallDown("onSetLabel", e);
}
}), enyo.kind({
name: "onyx.RangeSliderKnobLabel",
classes: "onyx-range-slider-label",
handlers: {
onSetLabel: "setLabel"
},
setLabel: function(e, t) {
this.setContent(t);
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !0, t);
},
release: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !1, t);
},
statics: {
addRemoveFlyweightClass: function(e, t, n, r, i) {
var s = r.flyweight;
if (s) {
var o = i !== undefined ? i : r.index;
s.performOnRow(o, function() {
e.addRemoveClass(t, n);
});
}
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
classes: "onyx-toolbar onyx-more-toolbar",
menuClass: "",
movedClass: "",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
handlers: {
onHide: "reflow"
},
published: {
clientLayoutKind: "FittableColumnsLayout"
},
tools: [ {
name: "client",
noStretch: !0,
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
onActivate: "activated",
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
scrolling: !1,
classes: "onyx-more-menu"
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments), this.$.client.setLayoutKind(this.clientLayoutKind);
},
clientLayoutKindChanged: function() {
this.$.client.setLayoutKind(this.clientLayoutKind);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(e, t) {
this.addRemoveClass("active", t.originator.active);
},
popItem: function() {
var e = this.findCollapsibleItem();
if (e) {
this.movedClass && this.movedClass.length > 0 && !e.hasClass(this.movedClass) && e.addClass(this.movedClass), this.$.menu.addChild(e, null);
var t = this.$.menu.hasNode();
return t && e.hasNode() && e.insertNodeInParent(t), !0;
}
},
pushItem: function() {
var e = this.$.menu.children, t = e[0];
if (t) {
this.movedClass && this.movedClass.length > 0 && t.hasClass(this.movedClass) && t.removeClass(this.movedClass), this.$.client.addChild(t);
var n = this.$.client.hasNode();
if (n && t.hasNode()) {
var r, i;
for (var s = 0; s < this.$.client.children.length; s++) {
var o = this.$.client.children[s];
if (o.toolbarIndex !== undefined && o.toolbarIndex != s) {
r = o, i = s;
break;
}
}
if (r && r.hasNode()) {
t.insertNodeInParent(n, r.node);
var u = this.$.client.children.pop();
this.$.client.children.splice(i, 0, u);
} else t.appendNodeToParent(n);
}
return !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) {
var e = this.$.client.children, t = e[e.length - 1].hasNode();
if (t) return this.$.client.reflow(), t.offsetLeft + t.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var e = this.$.client.children;
for (var t = e.length - 1; c = e[t]; t--) {
if (!c.unmoveable) return c;
c.toolbarIndex === undefined && (c.toolbarIndex = t);
}
}
});

// IntegerPicker.js

enyo.kind({
name: "onyx.IntegerPicker",
kind: "onyx.Picker",
published: {
value: 0,
min: 0,
max: 9
},
create: function() {
this.inherited(arguments), this.rangeChanged();
},
minChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
maxChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
rangeChanged: function() {
for (var e = this.min; e <= this.max; e++) this.createComponent({
content: e,
active: e === this.value ? !0 : !1
});
},
valueChanged: function(e) {
var t = this.getClientControls(), n = t.length;
this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;
for (var r = 0; r < n; r++) if (this.value === parseInt(t[r].content)) {
this.setSelected(t[r]);
break;
}
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
})), this.value = parseInt(this.selected.content);
}
});

// ContextualPopup.js

enyo.kind({
name: "onyx.ContextualPopup",
kind: "enyo.Popup",
modal: !0,
autoDismiss: !0,
floating: !1,
classes: "onyx-contextual-popup enyo-unselectable",
published: {
maxHeight: 100,
scrolling: !0,
title: undefined,
actionButtons: []
},
vertFlushMargin: 60,
horizFlushMargin: 50,
widePopup: 200,
longPopup: 200,
horizBuffer: 16,
events: {
onTap: ""
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestShow",
onRequestHideMenu: "requestHide"
},
components: [ {
name: "title",
classes: "onyx-contextual-popup-title"
}, {
classes: "onyx-contextual-popup-scroller",
components: [ {
name: "client",
kind: "enyo.Scroller",
vertical: "auto",
classes: "enyo-unselectable",
thumb: !1,
strategyKind: "TouchScrollStrategy"
} ]
}, {
name: "actionButtons",
classes: "onyx-contextual-popup-action-buttons"
} ],
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged(), this.titleChanged(), this.actionButtonsChanged();
},
getScroller: function() {
return this.$[this.scrollerName];
},
titleChanged: function() {
this.$.title.setContent(this.title);
},
actionButtonsChanged: function() {
for (var e = 0; e < this.actionButtons.length; e++) this.$.actionButtons.createComponent({
kind: "onyx.Button",
content: this.actionButtons[e].content,
classes: this.actionButtons[e].classes + " onyx-contextual-popup-action-button",
name: this.actionButtons[e].name ? this.actionButtons[e].name : "ActionButton" + e,
index: e,
tap: enyo.bind(this, this.tapHandler)
});
},
tapHandler: function(e, t) {
return t.actionButton = !0, t.popup = this, this.bubble("ontap", t), !0;
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition();
},
requestShow: function(e, t) {
var n = t.activator.hasNode();
return n && (this.activatorOffset = this.getPageOffset(n)), this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = this.getBoundingRect(e), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.resetPositioning();
var e = this.getViewWidth(), t = this.getViewHeight(), n = this.vertFlushMargin, r = t - this.vertFlushMargin, i = this.horizFlushMargin, s = e - this.horizFlushMargin;
if (this.activatorOffset.top + this.activatorOffset.height < n || this.activatorOffset.top > r) {
if (this.applyVerticalFlushPositioning(i, s)) return;
if (this.applyHorizontalFlushPositioning(i, s)) return;
if (this.applyVerticalPositioning()) return;
} else if (this.activatorOffset.left + this.activatorOffset.width < i || this.activatorOffset.left > s) if (this.applyHorizontalPositioning()) return;
var o = this.getBoundingRect(this.node);
if (o.width > this.widePopup) {
if (this.applyVerticalPositioning()) return;
} else if (o.height > this.longPopup && this.applyHorizontalPositioning()) return;
if (this.applyVerticalPositioning()) return;
if (this.applyHorizontalPositioning()) return;
}
},
initVerticalPositioning: function() {
this.resetPositioning(), this.addClass("vertical");
var e = this.getBoundingRect(this.node), t = this.getViewHeight();
return this.floating ? this.activatorOffset.top < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height,
bottom: "auto"
}), this.addClass("below")) : (this.applyPosition({
top: this.activatorOffset.top - e.height,
bottom: "auto"
}), this.addClass("above")) : e.top + e.height > t && t - e.bottom < e.top - e.height ? this.addClass("above") : this.addClass("below"), e = this.getBoundingRect(this.node), e.top + e.height > t || e.top < 0 ? !1 : !0;
},
applyVerticalPositioning: function() {
if (!this.initVerticalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
if (this.floating) {
var n = this.activatorOffset.left + this.activatorOffset.width / 2 - e.width / 2;
n + e.width > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.width
}), this.addClass("left")) : n < 0 ? (this.applyPosition({
left: this.activatorOffset.left
}), this.addClass("right")) : this.applyPosition({
left: n
});
} else {
var r = this.activatorOffset.left + this.activatorOffset.width / 2 - e.left - e.width / 2;
e.right + r > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.right
}), this.addRemoveClass("left", !0)) : e.left + r < 0 ? this.addRemoveClass("right", !0) : this.applyPosition({
left: r
});
}
return !0;
},
applyVerticalFlushPositioning: function(e, t) {
if (!this.initVerticalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.activatorOffset.left + this.activatorOffset.width / 2 < e ? (this.activatorOffset.left + this.activatorOffset.width / 2 < this.horizBuffer ? this.applyPosition({
left: this.horizBuffer + (this.floating ? 0 : -n.left)
}) : this.applyPosition({
left: this.activatorOffset.width / 2 + (this.floating ? this.activatorOffset.left : 0)
}), this.addClass("right"), this.addClass("corner"), !0) : this.activatorOffset.left + this.activatorOffset.width / 2 > t ? (this.activatorOffset.left + this.activatorOffset.width / 2 > r - this.horizBuffer ? this.applyPosition({
left: r - this.horizBuffer - n.right
}) : this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width / 2 - n.right
}), this.addClass("left"), this.addClass("corner"), !0) : !1;
},
initHorizontalPositioning: function() {
this.resetPositioning();
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
return this.floating ? this.activatorOffset.left + this.activatorOffset.width < t / 2 ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width
}), this.addRemoveClass("left", !0)) : (this.applyPosition({
left: this.activatorOffset.left - e.width
}), this.addRemoveClass("right", !0)) : this.activatorOffset.left - e.width > 0 ? (this.applyPosition({
left: this.activatorOffset.left - e.left - e.width
}), this.addRemoveClass("right", !0)) : (this.applyPosition({
left: this.activatorOffset.width
}), this.addRemoveClass("left", !0)), this.addRemoveClass("horizontal", !0), e = this.getBoundingRect(this.node), e.left < 0 || e.left + e.width > t ? !1 : !0;
},
applyHorizontalPositioning: function() {
if (!this.initHorizontalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewHeight(), n = this.activatorOffset.top + this.activatorOffset.height / 2;
return this.floating ? n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - e.height / 2,
bottom: "auto"
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top - this.activatorOffset.height,
bottom: "auto"
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top - e.height + this.activatorOffset.height * 2,
bottom: "auto"
}), this.addRemoveClass("low", !0)) : n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: (this.activatorOffset.height - e.height) / 2
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: -this.activatorOffset.height
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: e.top - e.height - this.activatorOffset.top + this.activatorOffset.height
}), this.addRemoveClass("low", !0)), !0;
},
applyHorizontalFlushPositioning: function(e, t) {
if (!this.initHorizontalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.floating ? this.activatorOffset.top < innerHeight / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - n.height
}), this.addRemoveClass("low", !0)) : n.top + n.height > innerHeight && innerHeight - n.bottom < n.top - n.height ? (this.applyPosition({
top: n.top - n.height - this.activatorOffset.top - this.activatorOffset.height / 2
}), this.addRemoveClass("low", !0)) : (this.applyPosition({
top: this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)), this.activatorOffset.left + this.activatorOffset.width < e ? (this.addClass("left"), this.addClass("corner"), !0) : this.activatorOffset.left > t ? (this.addClass("right"), this.addClass("corner"), !0) : !1;
},
getBoundingRect: function(e) {
var t = e.getBoundingClientRect();
return !t.width || !t.height ? {
left: t.left,
right: t.right,
top: t.top,
bottom: t.bottom,
width: t.right - t.left,
height: t.bottom - t.top
} : t;
},
getViewHeight: function() {
return window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight;
},
getViewWidth: function() {
return window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
},
resetPositioning: function() {
this.removeClass("right"), this.removeClass("left"), this.removeClass("high"), this.removeClass("low"), this.removeClass("corner"), this.removeClass("below"), this.removeClass("above"), this.removeClass("vertical"), this.removeClass("horizontal"), this.applyPosition({
left: "auto"
}), this.applyPosition({
top: "auto"
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// App.js

enyo.kind({
name: "PanelsSample",
kind: "FittableRows",
components: [ {
kind: "FittableColumns",
noStretch: !0,
classes: "onyx-toolbar onyx-toolbar-inline",
components: [ {
kind: "Scroller",
thumb: !1,
fit: !0,
touch: !0,
vertical: "hidden",
style: "margin: 0;",
components: [ {
classes: "onyx-toolbar-inline",
style: "white-space: nowrap;",
components: [ {
kind: "onyx.Grabber"
}, {
name: "Section",
content: "SeamlessNotes"
} ]
} ]
} ]
}, {
kind: "Panels",
fit: !0,
arrangerKind: "CardSlideInArranger",
classes: "panels-sample",
narrowFit: !1,
components: [ {
name: "Home",
content: "Home",
components: [ {
kind: "Home"
} ]
}, {
name: "SubmittedComposition",
content: "SubmittedComposition",
components: [ {
kind: "SubmittedComposition"
} ]
}, {
name: "CompositionOverview",
content: "Composition Overview",
components: [ {
kind: "CompositionOverview"
} ]
}, {
name: "Assimilate",
content: "Assimilate",
components: [ {
kind: "Assimilate"
} ]
}, {
name: "Analyse",
content: "Analyse",
components: [ {
kind: "Analyse"
} ]
}, {
name: "Complete Transcription",
content: "Complete Transcription",
components: [ {
kind: "CompleteTranscription"
} ]
} ]
} ]
});

// Home.js

enyo.kind({
name: "Home",
kind: "FittableColumns",
classes: "enyo-fit",
components: [ {
kind: "FittableRows",
fit: !0,
components: [ {
kind: "onyx.Groupbox",
classes: "onyx-sample-result-box",
components: [ {
kind: "onyx.GroupboxHeader"
}, {
name: "result",
classes: "onyx-sample-result"
}, {
kind: "onyx.Button",
content: "Load New Composition",
classes: "onyx-dark",
style: "height: 70px; width: 100%;",
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "Submitted Composition",
classes: "onyx-dark",
style: "height: 70px; width: 100%;",
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "Composition Overview",
classes: "onyx-dark",
style: "height: 70px; width: 100%;",
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "Assimilate the musical phrases in the composition",
classes: "onyx-dark",
style: "height: 70px; width: 100%;",
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "Analyse the phrases in the composition by selection for compare and contrast",
classes: "onyx-dark",
style: "height: 70px; width: 100%;",
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "Complete Transcribed Composition",
classes: "onyx-dark",
style: "height: 70px; width: 100%;",
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "Tutorials",
classes: "onyx-dark",
style: "height: 70px; width: 100%;",
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "About Us",
classes: "onyx-dark",
style: "height: 70px; width: 100%;",
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "Contact Us",
classes: "onyx-dark",
style: "height: 70px; width: 100%;",
ontap: "buttonTapped"
} ]
}, {
fit: !0,
classes: "fittable-sample-fitting-color"
}, {
kind: "onyx.Toolbar",
components: [ {
content: "Home"
} ]
} ]
} ],
buttonTapped: function(e, t) {
e.content ? this.$.result.setContent('The "' + e.getContent() + '" button was tapped') : this.$.result.setContent('The "' + e.getName() + '" button was tapped');
},
gotoPanel: function() {
this.$.samplePanels.setIndex(this.$.input.getValue());
}
});

// SubmittedComposition.js

enyo.kind({
name: "SubmittedComposition",
kind: "FittableColumns",
classes: "enyo-fit",
components: [ {
kind: "FittableRows",
classes: "fittable-sample-shadow",
style: "width: 100%; position: relative;",
components: [ {
fit: !0
}, {
kind: "onyx.Toolbar",
components: [ {
content: "Composition contents"
} ]
} ]
} ]
});

// CompositionOverview.js

enyo.kind({
name: "CompositionOverview",
kind: "FittableColumns",
classes: "enyo-fit",
components: [ {
kind: "FittableRows",
fit: !0,
components: [ {
fit: !0,
classes: "fittable-sample-fitting-color"
}, {
kind: "onyx.Toolbar",
components: [ {
content: "Phrases marked with placeholders"
} ]
} ]
}, {
kind: "FittableRows",
classes: "fittable-sample-shadow",
style: "width: 15%; position: relative;",
components: [ {
fit: !0
}, {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.Button",
content: "Analyse phrases"
} ]
} ]
} ]
});

// Assimilate.js

enyo.kind({
name: "Assimilate",
kind: "FittableRows",
classes: "enyo-fit",
fit: !0,
components: [ {
kind: "FittableColumns",
fit: !0,
classes: "fittable-sample-fitting-color",
fit: !0,
components: [ {
kind: enyo.Image,
src: "http://upload.wikimedia.org/wikipedia/commons/0/02/ScientificGraphSpeedVsTime.svg",
fit: !0
} ]
}, {
classes: "fittable-sample-shadow3",
style: "height: 30%; position: relative;"
}, {
kind: "SoundControls"
}, {
kind: "onyx.Toolbar",
components: [ {
content: "Assimilate - Syllables for the musical phrase"
} ]
} ]
});

// Analyse.js

enyo.kind({
name: "Analyse",
kind: "FittableRows",
classes: "enyo-fit",
fit: !0,
components: [ {
kind: "FittableColumns",
classes: "fittable-sample-fitting-color",
fit: !1,
components: [ {
style: "width : 50%;",
content: "Chained view"
}, {
style: "width : 50%;",
content: "Superimposed view"
} ]
}, {
kind: "FittableColumns",
classes: "fittable-sample-fitting-color",
fit: !0,
components: [ {
kind: enyo.Image,
classes: "fittable-sample-box fittable-sample-mlr",
style: "width : 50%",
src: "http://upload.wikimedia.org/wikipedia/commons/0/02/ScientificGraphSpeedVsTime.svg"
}, {
kind: enyo.Image,
classes: "fittable-sample-box fittable-sample-mlr",
style: "width : 50%;",
src: "http://upload.wikimedia.org/wikipedia/commons/0/02/ScientificGraphSpeedVsTime.svg"
} ]
}, {
classes: "fittable-sample-shadow3",
style: "height: 30%; width: 100%;position: relative;",
fit: !0
}, {
kind: "SoundControls",
fit: !0
}, {
kind: "onyx.Toolbar",
fit: !0,
components: [ {
content: "Analyse - Comparison of the phrase syllables"
} ]
} ]
});

// CompleteTranscription.js

enyo.kind({
name: "CompleteTranscription",
kind: "FittableColumns",
classes: "enyo-fit",
components: [ {
kind: "FittableRows",
classes: "fittable-sample-shadow",
style: "width: 100%; position: relative;",
components: [ {
fit: !0
}, {
kind: "onyx.Toolbar",
components: [ {
content: "Completely transcribed composition"
} ]
} ]
} ]
});

// SoundOptions.js

enyo.kind({
name: "SoundOptions",
components: [ {
tag: "br"
}, {
kind: "onyx.PickerDecorator",
components: [ {
kind: "onyx.PickerButton",
content: "Instrument Group..."
}, {
kind: "onyx.Picker",
components: [ {
content: "Group 1"
}, {
content: "Group 2"
}, {
content: "Group 3"
} ]
} ]
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.PickerDecorator",
components: [ {
kind: "onyx.PickerButton",
content: "Instrument.."
}, {
kind: "onyx.Picker",
components: [ {
content: "Instrument 1"
}, {
content: "Instrument 2"
}, {
content: "Instrument 3"
} ]
} ]
}, {
tag: "br"
} ]
});

// SoundControls.js

enyo.kind({
name: "SoundControls",
classes: "onyx-sample-result",
content: "Sound Controls",
components: [ {
content: "Tempo"
}, {
kind: "onyx.Slider",
value: 50,
onChanging: "sliderChanging",
onChange: "sliderChanged"
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: "Play Instrumental",
style: "width: 33.3%;",
ontap: "playInstrumental"
}, {
kind: "onyx.Button",
content: "Play Vocal",
style: "width: 33.3%;",
ontap: "playVocal"
}, {
kind: "onyx.Button",
content: "Sound Controls",
style: "width: 33.3%;",
ontap: "showPopup",
popup: "modalPopup"
}, {
name: "modalPopup",
classes: "onyx-sample-popup",
kind: "onyx.Popup",
centered: !0,
modal: !0,
floating: !0,
onShow: "popupShown",
onHide: "popupHidden",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
kind: "SoundOptions"
} ]
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: "Ok",
ontap: "closeModalPopup"
} ]
} ],
showPopup: function(e) {
var t = this.$[e.popup];
t && t.show();
},
showPopupAtEvent: function(e, t) {
var n = this.$[e.popup];
n && n.showAtEvent(t);
},
popupHidden: function() {
document.activeElement.blur(), this.$.modalPopup.showing && enyo.job("focus", enyo.bind(this.$.input, "focus"), 500);
},
popupShown: function() {
this.$.input.focus(), enyo.job("focus", enyo.bind(this.$.input, "focus"), 500);
},
closeModalPopup: function() {
this.$.modalPopup.hide();
},
playInstrumental: function() {
var e = [ "data:audio/midi;base64,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" ];
MIDI.loadPlugin(function() {
var t = MIDI.Player;
t.timeWarp = 1, t.loadFile(e[0], t.start);
});
},
playVocal: function() {
var e = new buzz.sound("http://www.cardonadesigns.com/html5/audio/all-is-illusion.mp3");
e.setSpeed(1), e.play();
}
});

// Midi/js/MIDI/AudioDetect.js

if (typeof MIDI == "undefined") var MIDI = {};

(function() {
"use strict";
var e = {}, t = function(t) {
var n = new Audio, r = t.split(";")[0];
n.id = "audio", n.setAttribute("preload", "auto"), n.setAttribute("audiobuffer", !0), n.addEventListener("canplaythrough", function() {
e[r] = !0;
}, !1), n.src = "data:" + t, document.body.appendChild(n);
};
MIDI.audioDetect = function(n) {
if (typeof Audio == "undefined") return n({});
var r = new Audio;
if (typeof r.canPlayType == "undefined") return n(e);
var i = r.canPlayType('audio/ogg; codecs="vorbis"');
i = i === "probably" || i === "maybe";
var s = r.canPlayType("audio/mpeg");
s = s === "probably" || s === "maybe";
if (!i && !s) {
n(e);
return;
}
i && t("audio/ogg;base64,T2dnUwACAAAAAAAAAADqnjMlAAAAAOyyzPIBHgF2b3JiaXMAAAAAAUAfAABAHwAAQB8AAEAfAACZAU9nZ1MAAAAAAAAAAAAA6p4zJQEAAAANJGeqCj3//////////5ADdm9yYmlzLQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMTAxMTAxIChTY2hhdWZlbnVnZ2V0KQAAAAABBXZvcmJpcw9CQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBACAAAAYRqF1TCqDEEPKQ4QUY9AzoxBDDEzGHGNONKQMMogzxZAyiFssLqgQBKEhKwKAKAAAwBjEGGIMOeekZFIi55iUTkoDnaPUUcoolRRLjBmlEluJMYLOUeooZZRCjKXFjFKJscRUAABAgAMAQICFUGjIigAgCgCAMAYphZRCjCnmFHOIMeUcgwwxxiBkzinoGJNOSuWck85JiRhjzjEHlXNOSuekctBJyaQTAAAQ4AAAEGAhFBqyIgCIEwAwSJKmWZomipamiaJniqrqiaKqWp5nmp5pqqpnmqpqqqrrmqrqypbnmaZnmqrqmaaqiqbquqaquq6nqrZsuqoum65q267s+rZru77uqapsm6or66bqyrrqyrbuurbtS56nqqKquq5nqq6ruq5uq65r25pqyq6purJtuq4tu7Js664s67pmqq5suqotm64s667s2rYqy7ovuq5uq7Ks+6os+75s67ru2rrwi65r66os674qy74x27bwy7ouHJMnqqqnqq7rmarrqq5r26rr2rqmmq5suq4tm6or26os67Yry7aumaosm64r26bryrIqy77vyrJui67r66Ys67oqy8Lu6roxzLat+6Lr6roqy7qvyrKuu7ru+7JuC7umqrpuyrKvm7Ks+7auC8us27oxuq7vq7It/KosC7+u+8Iy6z5jdF1fV21ZGFbZ9n3d95Vj1nVhWW1b+V1bZ7y+bgy7bvzKrQvLstq2scy6rSyvrxvDLux8W/iVmqratum6um7Ksq/Lui60dd1XRtf1fdW2fV+VZd+3hV9pG8OwjK6r+6os68Jry8ov67qw7MIvLKttK7+r68ow27qw3L6wLL/uC8uq277v6rrStXVluX2fsSu38QsAABhwAAAIMKEMFBqyIgCIEwBAEHIOKQahYgpCCKGkEEIqFWNSMuakZM5JKaWUFEpJrWJMSuaclMwxKaGUlkopqYRSWiqlxBRKaS2l1mJKqcVQSmulpNZKSa2llGJMrcUYMSYlc05K5pyUklJrJZXWMucoZQ5K6iCklEoqraTUYuacpA46Kx2E1EoqMZWUYgupxFZKaq2kFGMrMdXUWo4hpRhLSrGVlFptMdXWWqs1YkxK5pyUzDkqJaXWSiqtZc5J6iC01DkoqaTUYiopxco5SR2ElDLIqJSUWiupxBJSia20FGMpqcXUYq4pxRZDSS2WlFosqcTWYoy1tVRTJ6XFklKMJZUYW6y5ttZqDKXEVkqLsaSUW2sx1xZjjqGkFksrsZWUWmy15dhayzW1VGNKrdYWY40x5ZRrrT2n1mJNMdXaWqy51ZZbzLXnTkprpZQWS0oxttZijTHmHEppraQUWykpxtZara3FXEMpsZXSWiypxNhirLXFVmNqrcYWW62ltVprrb3GVlsurdXcYqw9tZRrrLXmWFNtBQAADDgAAASYUAYKDVkJAEQBAADGMMYYhEYpx5yT0ijlnHNSKucghJBS5hyEEFLKnINQSkuZcxBKSSmUklJqrYVSUmqttQIAAAocAAACbNCUWByg0JCVAEAqAIDBcTRNFFXVdX1fsSxRVFXXlW3jVyxNFFVVdm1b+DVRVFXXtW3bFn5NFFVVdmXZtoWiqrqybduybgvDqKqua9uybeuorqvbuq3bui9UXVmWbVu3dR3XtnXd9nVd+Bmzbeu2buu+8CMMR9/4IeTj+3RCCAAAT3AAACqwYXWEk6KxwEJDVgIAGQAAgDFKGYUYM0gxphhjTDHGmAAAgAEHAIAAE8pAoSErAoAoAADAOeecc84555xzzjnnnHPOOeecc44xxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY0wAwE6EA8BOhIVQaMhKACAcAABACCEpKaWUUkoRU85BSSmllFKqFIOMSkoppZRSpBR1lFJKKaWUIqWgpJJSSimllElJKaWUUkoppYw6SimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaVUSimllFJKKaWUUkoppRQAYPLgAACVYOMMK0lnhaPBhYasBAByAwAAhRiDEEJpraRUUkolVc5BKCWUlEpKKZWUUqqYgxBKKqmlklJKKbXSQSihlFBKKSWUUkooJYQQSgmhlFRCK6mEUkoHoYQSQimhhFRKKSWUzkEoIYUOQkmllNRCSB10VFIpIZVSSiklpZQ6CKGUklJLLZVSWkqpdBJSKamV1FJqqbWSUgmhpFZKSSWl0lpJJbUSSkklpZRSSymFVFJJJYSSUioltZZaSqm11lJIqZWUUkqppdRSSiWlkEpKqZSSUmollZRSaiGVlEpJKaTUSimlpFRCSamlUlpKLbWUSkmptFRSSaWUlEpJKaVSSksppRJKSqmllFpJKYWSUkoplZJSSyW1VEoKJaWUUkmptJRSSymVklIBAEAHDgAAAUZUWoidZlx5BI4oZJiAAgAAQABAgAkgMEBQMApBgDACAQAAAADAAAAfAABHARAR0ZzBAUKCwgJDg8MDAAAAAAAAAAAAAACAT2dnUwAEAAAAAAAAAADqnjMlAgAAADzQPmcBAQA="), s && t("audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
var o = (new Date).getTime(), u = window.setInterval(function() {
for (var t in e) ;
var r = (new Date).getTime(), i = r - o > 5e3;
if (t || i) window.clearInterval(u), n(e);
}, 1);
};
})();

// Midi/js/MIDI/LoadPlugin.js

if (typeof MIDI == "undefined") var MIDI = {};

typeof MIDI.Soundfont == "undefined" && (MIDI.Soundfont = {}), function() {
"use strict";
var e = !1, t = !1;
MIDI.loadPlugin = function(e) {
typeof e == "function" && (e = {
callback: e
});
var i = e.instruments || e.instrument || "acoustic_grand_piano";
typeof i != "object" && (i = [ i ]);
for (var s = 0; s < i.length; s++) {
var o = i[s];
typeof o == "number" && (i[s] = MIDI.GeneralMIDI.byId[o]);
}
MIDI.soundfontUrl = e.soundfontUrl || MIDI.soundfontUrl || "./soundfont/", MIDI.audioDetect(function(s) {
var o = "";
r[e.api] ? o = e.api : r[window.location.hash.substr(1)] ? o = window.location.hash.substr(1) : t && navigator.requestMIDIAccess ? o = "webmidi" : window.webkitAudioContext ? o = "webaudio" : window.Audio ? o = "audiotag" : o = "flash";
if (!n[o]) return;
var u = s["audio/ogg"] ? "ogg" : "mp3";
n[o](u, i, e);
});
};
var n = {};
n.webmidi = function(e, t, n) {
MIDI.loader && MIDI.loader.message("Web MIDI API..."), MIDI.WebMIDI.connect(n);
}, n.flash = function(e, t, n) {
MIDI.loader && MIDI.loader.message("Flash API..."), DOMLoader.script.add({
src: n.soundManagerUrl || "./inc/SoundManager2/script/soundmanager2.js",
verify: "SoundManager",
callback: function() {
MIDI.Flash.connect(t, n);
}
});
}, n.audiotag = function(t, n, r) {
MIDI.loader && MIDI.loader.message("HTML5 Audio API...");
var o = s({
items: n,
getNext: function(n) {
e ? DOMLoader.sendRequest({
url: MIDI.soundfontUrl + n + "-" + t + ".js",
onprogress: i,
onload: function(e) {
MIDI.Soundfont[n] = JSON.parse(e.responseText), MIDI.loader && MIDI.loader.update(null, "Downloading", 100), o.getNext();
}
}) : DOMLoader.script.add({
src: MIDI.soundfontUrl + n + "-" + t + ".js",
verify: "MIDI.Soundfont." + n,
callback: function() {
MIDI.loader && MIDI.loader.update(null, "Downloading...", 100), o.getNext();
}
});
},
onComplete: function() {
MIDI.AudioTag.connect(r);
}
});
}, n.webaudio = function(t, n, r) {
MIDI.loader && MIDI.loader.message("Web Audio API...");
var o = s({
items: n,
getNext: function(n) {
e ? DOMLoader.sendRequest({
url: MIDI.soundfontUrl + n + "-" + t + ".js",
onprogress: i,
onload: function(e) {
MIDI.Soundfont[n] = JSON.parse(e.responseText), MIDI.loader && MIDI.loader.update(null, "Downloading...", 100), o.getNext();
}
}) : DOMLoader.script.add({
src: MIDI.soundfontUrl + n + "-" + t + ".js",
verify: "MIDI.Soundfont." + n,
callback: function() {
MIDI.loader && MIDI.loader.update(null, "Downloading...", 100), o.getNext();
}
});
},
onComplete: function() {
MIDI.WebAudio.connect(r);
}
});
};
var r = {
webmidi: !0,
webaudio: !0,
audiotag: !0,
flash: !0
}, i = function(e) {
this.totalSize || (this.getResponseHeader("Content-Length-Raw") ? this.totalSize = parseInt(this.getResponseHeader("Content-Length-Raw")) : this.totalSize = e.total);
var t = this.totalSize ? Math.round(e.loaded / this.totalSize * 100) : "";
MIDI.loader && MIDI.loader.update(null, "Downloading...", t);
}, s = function(e) {
var t = {};
t.queue = [];
for (var n in e.items) t.queue.push(e.items[n]);
return t.getNext = function() {
if (!t.queue.length) return e.onComplete();
e.getNext(t.queue.shift());
}, setTimeout(t.getNext, 1), t;
};
}();

// Midi/js/MIDI/Plugin.js

if (typeof MIDI == "undefined") var MIDI = {};

(function() {
"use strict";
var e = function(e) {
MIDI.api = e.api, MIDI.setVolume = e.setVolume, MIDI.programChange = e.programChange, MIDI.noteOn = e.noteOn, MIDI.noteOff = e.noteOff, MIDI.chordOn = e.chordOn, MIDI.chordOff = e.chordOff, MIDI.stopAllNotes = e.stopAllNotes, MIDI.getInput = e.getInput, MIDI.getOutputs = e.getOutputs;
};
(function() {
var t = null, n = null, r = [], i = MIDI.WebMIDI = {
api: "webmidi"
};
i.setVolume = function(e, t) {
n.send([ 176 + e, 7, t ]);
}, i.programChange = function(e, t) {
n.send([ 192 + e, t ]);
}, i.noteOn = function(e, t, r, i) {
n.send([ 144 + e, t, r ], i * 1e3);
}, i.noteOff = function(e, t, r) {
n.send([ 128 + e, t, 0 ], r * 1e3);
}, i.chordOn = function(e, t, r, i) {
for (var s = 0; s < t.length; s++) {
var o = t[s];
n.send([ 144 + e, o, r ], i * 1e3);
}
}, i.chordOff = function(e, t, r) {
for (var i = 0; i < t.length; i++) {
var s = t[i];
n.send([ 128 + e, s, 0 ], r * 1e3);
}
}, i.stopAllNotes = function() {
for (var e = 0; e < 16; e++) n.send([ 176 + e, 123, 0 ]);
}, i.getInput = function() {
return t.getInputs();
}, i.getOutputs = function() {
return t.getOutputs();
}, i.connect = function(r) {
e(i), navigator.requestMIDIAccess(function(e) {
t = e, n = t.getOutput(0), r.callback && r.callback();
}, function(e) {
window.webkitAudioContext ? r.api = "webaudio" : window.Audio ? r.api = "audiotag" : r.api = "flash", MIDI.loadPlugin(r);
});
};
})(), (window.AudioContext || window.webkitAudioContext) && function() {
var t = window.AudioContext || window.webkitAudioContext, n = MIDI.WebAudio = {
api: "webaudio"
}, r, i = {}, s = 127, o = {}, u = function(e, t, n, i, s) {
var u = MIDI.GeneralMIDI.byName[e], a = u.number, f = t[n];
if (!MIDI.Soundfont[e][f]) return s(e);
var l = MIDI.Soundfont[e][f].split(",")[1], c = Base64Binary.decodeArrayBuffer(l);
r.decodeAudioData(c, function(r) {
var l = f;
while (l.length < 3) l += "&nbsp;";
typeof MIDI.loader != "undefined" && MIDI.loader.update(null, u.instrument + "<br>Processing: " + (n / 87 * 100 >> 0) + "%<br>" + l), r.id = f, i[n] = r;
if (i.length === t.length) {
while (i.length) {
r = i.pop();
if (!r) continue;
var c = MIDI.keyToNote[r.id];
o[a + "" + c] = r;
}
s(e);
}
});
};
n.setVolume = function(e, t) {
s = t;
}, n.programChange = function(e, t) {
MIDI.channels[e].instrument = t;
}, n.noteOn = function(e, t, n, u) {
if (!MIDI.channels[e]) return;
var a = MIDI.channels[e].instrument;
if (!o[a + "" + t]) return;
u < r.currentTime && (u += r.currentTime);
var f = r.createBufferSource();
i[e + "" + t] = f, f.buffer = o[a + "" + t], f.connect(r.destination);
var l = r.createGainNode(), c = n / 127 * (s / 127) * 2 - 1;
return l.connect(r.destination), l.gain.value = Math.max(-1, c), f.connect(l), f.noteOn(u || 0), f;
}, n.noteOff = function(e, t, n) {
n = n || 0, n < r.currentTime && (n += r.currentTime);
var s = i[e + "" + t];
if (!s) return;
return s.gain.linearRampToValueAtTime(1, n), s.gain.linearRampToValueAtTime(0, n + .2), s.noteOff(n + .3), s;
}, n.chordOn = function(e, t, r, i) {
var s = {}, o;
for (var u = 0, a = t.length; u < a; u++) s[o = t[u]] = n.noteOn(e, o, r, i);
return s;
}, n.chordOff = function(e, t, r) {
var i = {}, s;
for (var o = 0, u = t.length; o < u; o++) i[s = t[o]] = n.noteOff(e, s, r);
return i;
}, n.connect = function(i) {
e(n), MIDI.Player.ctx = r = new t;
var s = [], o = MIDI.keyToNote;
for (var a in o) s.push(a);
var f = [], l = {}, c = function(e) {
delete l[e];
for (var t in l) break;
t || i.callback();
};
for (var h in MIDI.Soundfont) {
l[h] = !0;
for (var p = 0; p < s.length; p++) u(h, s, p, f, c);
}
};
}(), window.Audio && function() {
var t = MIDI.AudioTag = {
api: "audiotag"
}, n = {}, r = 127, i = -1, s = [], o = [], u = {};
for (var a = 0; a < 12; a++) s[a] = new Audio;
var f = function(e, t) {
if (!MIDI.channels[e]) return;
var n = MIDI.channels[e].instrument, a = MIDI.GeneralMIDI.byId[n].id, t = u[t];
if (!t) return;
var f = a + "" + t.id, l = (i + 1) % s.length, c = s[l];
o[l] = f, c.src = MIDI.Soundfont[a][t.id], c.volume = r / 127, c.play(), i = l;
}, l = function(e, t) {
if (!MIDI.channels[e]) return;
var n = MIDI.channels[e].instrument, r = MIDI.GeneralMIDI.byId[n].id, t = u[t];
if (!t) return;
var a = r + "" + t.id;
for (var f = 0; f < s.length; f++) {
var l = (f + i + 1) % s.length, c = o[l];
if (c && c == a) {
s[l].pause(), o[l] = null;
return;
}
}
};
t.programChange = function(e, t) {
MIDI.channels[e].instrument = t;
}, t.setVolume = function(e, t) {
r = t;
}, t.noteOn = function(e, t, r, i) {
var s = n[t];
if (!u[s]) return;
if (i) return window.setTimeout(function() {
f(e, s);
}, i * 1e3);
f(e, s);
}, t.noteOff = function(e, t, r) {
var i = n[t];
if (!u[i]) return;
if (r) return setTimeout(function() {
l(e, i);
}, r * 1e3);
l(e, i);
}, t.chordOn = function(e, t, r, i) {
for (var s = 0; s < t.length; s++) {
var o = t[s], a = n[o];
if (!u[a]) continue;
if (i) return window.setTimeout(function() {
f(e, a);
}, i * 1e3);
f(e, a);
}
}, t.chordOff = function(e, t, r) {
for (var i = 0; i < t.length; i++) {
var s = t[i], o = n[s];
if (!u[o]) continue;
if (r) return window.setTimeout(function() {
l(e, o);
}, r * 1e3);
l(e, o);
}
}, t.stopAllNotes = function() {
for (var e = 0, t = s.length; e < t; e++) s[e].pause();
}, t.connect = function(r) {
for (var i in MIDI.keyToNote) n[MIDI.keyToNote[i]] = i, u[i] = {
id: i
};
e(t), r.callback && r.callback();
};
}(), function() {
var t = MIDI.Flash = {
api: "flash"
}, n = {}, r = {};
t.programChange = function(e, t) {
MIDI.channels[e].instrument = t;
}, t.setVolume = function(e, t) {}, t.noteOn = function(e, t, i, s) {
if (!MIDI.channels[e]) return;
var o = MIDI.channels[e].instrument, u = MIDI.GeneralMIDI.byId[o].number;
t = u + "" + n[t];
if (!r[t]) return;
if (s) return window.setTimeout(function() {
r[t].play({
volume: i * 2
});
}, s * 1e3);
r[t].play({
volume: i * 2
});
}, t.noteOff = function(e, t, n) {}, t.chordOn = function(e, t, i, s) {
if (!MIDI.channels[e]) return;
var o = MIDI.channels[e].instrument, u = MIDI.GeneralMIDI.byId[o].number;
for (var a in t) {
var f = t[a], l = u + "" + n[f];
r[l] && r[l].play({
volume: i * 2
});
}
}, t.chordOff = function(e, t, n) {}, t.stopAllNotes = function() {}, t.connect = function(i, s) {
soundManager.flashVersion = 9, soundManager.useHTML5Audio = !0, soundManager.url = s.soundManagerSwfUrl || "../inc/SoundManager2/swf/", soundManager.useHighPerformance = !0, soundManager.wmode = "transparent", soundManager.flashPollingInterval = 1, soundManager.debugMode = !1, soundManager.onload = function() {
var o = function(e, t, n) {
var i = MIDI.GeneralMIDI.byName[e], s = i.number;
r[s + "" + t] = soundManager.createSound({
id: t,
url: MIDI.soundfontUrl + e + "-mp3/" + t + ".mp3",
multiShot: !0,
autoLoad: !0,
onload: n
});
}, u = [], a = 88, f = i.length * a;
for (var l = 0; l < i.length; l++) {
var c = i[l], h = function() {
u.push(this.sID);
if (typeof MIDI.loader == "undefined") return;
MIDI.loader.update(null, "Processing: " + this.sID);
};
for (var p = 0; p < a; p++) {
var d = n[p + 21];
o(c, d, h);
}
}
e(t);
var v = window.setInterval(function() {
if (u.length < f) return;
window.clearInterval(v), s.callback && s.callback();
}, 25);
}, soundManager.onerror = function() {};
for (var o in MIDI.keyToNote) n[MIDI.keyToNote[o]] = o;
};
}(), MIDI.GeneralMIDI = function(e) {
var t = function(e) {
return e.replace(/[^a-z0-9 ]/gi, "").replace(/[ ]/g, "_").toLowerCase();
}, n = {
byName: {},
byId: {},
byCategory: {}
};
for (var r in e) {
var i = e[r];
for (var s = 0, o = i.length; s < o; s++) {
var u = i[s];
if (!u) continue;
var a = parseInt(u.substr(0, u.indexOf(" ")), 10);
u = u.replace(a + " ", ""), n.byId[--a] = n.byName[t(u)] = n.byCategory[t(r)] = {
id: t(u),
instrument: u,
number: a,
category: r
};
}
}
return n;
}({
Piano: [ "1 Acoustic Grand Piano", "2 Bright Acoustic Piano", "3 Electric Grand Piano", "4 Honky-tonk Piano", "5 Electric Piano 1", "6 Electric Piano 2", "7 Harpsichord", "8 Clavinet" ],
"Chromatic Percussion": [ "9 Celesta", "10 Glockenspiel", "11 Music Box", "12 Vibraphone", "13 Marimba", "14 Xylophone", "15 Tubular Bells", "16 Dulcimer" ],
Organ: [ "17 Drawbar Organ", "18 Percussive Organ", "19 Rock Organ", "20 Church Organ", "21 Reed Organ", "22 Accordion", "23 Harmonica", "24 Tango Accordion" ],
Guitar: [ "25 Acoustic Guitar (nylon)", "26 Acoustic Guitar (steel)", "27 Electric Guitar (jazz)", "28 Electric Guitar (clean)", "29 Electric Guitar (muted)", "30 Overdriven Guitar", "31 Distortion Guitar", "32 Guitar Harmonics" ],
Bass: [ "33 Acoustic Bass", "34 Electric Bass (finger)", "35 Electric Bass (pick)", "36 Fretless Bass", "37 Slap Bass 1", "38 Slap Bass 2", "39 Synth Bass 1", "40 Synth Bass 2" ],
Strings: [ "41 Violin", "42 Viola", "43 Cello", "44 Contrabass", "45 Tremolo Strings", "46 Pizzicato Strings", "47 Orchestral Harp", "48 Timpani" ],
Ensemble: [ "49 String Ensemble 1", "50 String Ensemble 2", "51 Synth Strings 1", "52 Synth Strings 2", "53 Choir Aahs", "54 Voice Oohs", "55 Synth Choir", "56 Orchestra Hit" ],
Brass: [ "57 Trumpet", "58 Trombone", "59 Tuba", "60 Muted Trumpet", "61 French Horn", "62 Brass Section", "63 Synth Brass 1", "64 Synth Brass 2" ],
Reed: [ "65 Soprano Sax", "66 Alto Sax", "67 Tenor Sax", "68 Baritone Sax", "69 Oboe", "70 English Horn", "71 Bassoon", "72 Clarinet" ],
Pipe: [ "73 Piccolo", "74 Flute", "75 Recorder", "76 Pan Flute", "77 Blown Bottle", "78 Shakuhachi", "79 Whistle", "80 Ocarina" ],
"Synth Lead": [ "81 Lead 1 (square)", "82 Lead 2 (sawtooth)", "83 Lead 3 (calliope)", "84 Lead 4 (chiff)", "85 Lead 5 (charang)", "86 Lead 6 (voice)", "87 Lead 7 (fifths)", "88 Lead 8 (bass + lead)" ],
"Synth Pad": [ "89 Pad 1 (new age)", "90 Pad 2 (warm)", "91 Pad 3 (polysynth)", "92 Pad 4 (choir)", "93 Pad 5 (bowed)", "94 Pad 6 (metallic)", "95 Pad 7 (halo)", "96 Pad 8 (sweep)" ],
"Synth Effects": [ "97 FX 1 (rain)", "98 FX 2 (soundtrack)", "99 FX 3 (crystal)", "100 FX 4 (atmosphere)", "101 FX 5 (brightness)", "102 FX 6 (goblins)", "103 FX 7 (echoes)", "104 FX 8 (sci-fi)" ],
Ethnic: [ "105 Sitar", "106 Banjo", "107 Shamisen", "108 Koto", "109 Kalimba", "110 Bagpipe", "111 Fiddle", "112 Shanai" ],
Percussive: [ "113 Tinkle Bell", "114 Agogo", "115 Steel Drums", "116 Woodblock", "117 Taiko Drum", "118 Melodic Tom", "119 Synth Drum" ],
"Sound effects": [ "120 Reverse Cymbal", "121 Guitar Fret Noise", "122 Breath Noise", "123 Seashore", "124 Bird Tweet", "125 Telephone Ring", "126 Helicopter", "127 Applause", "128 Gunshot" ]
}), MIDI.channels = function() {
var e = {};
for (var t = 0; t < 16; t++) e[t] = {
instrument: 0,
mute: !1,
mono: !1,
omni: !1,
solo: !1
};
return e;
}(), MIDI.pianoKeyOffset = 21, MIDI.keyToNote = {}, MIDI.noteToKey = {}, function() {
var e = 21, t = 108, n = [ "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B" ];
for (var r = e; r <= t; r++) {
var i = (r - 12) / 12 >> 0, s = n[r % 12] + i;
MIDI.keyToNote[s] = r, MIDI.noteToKey[r] = s;
}
}();
})();

// Midi/js/MIDI/Player.js

if (typeof MIDI == "undefined") var MIDI = {};

typeof MIDI.Player == "undefined" && (MIDI.Player = {}), function() {
"use strict";
var e = MIDI.Player;
e.callback = undefined, e.currentTime = 0, e.endTime = 0, e.restart = 0, e.playing = !1, e.timeWarp = 1, e.start = e.resume = function() {
e.currentTime < -1 && (e.currentTime = -1), f(e.currentTime);
}, e.pause = function() {
var t = e.restart;
l(), e.restart = t;
}, e.stop = function() {
l(), e.restart = 0, e.currentTime = 0;
}, e.addListener = function(e) {
s = e;
}, e.removeListener = function() {
s = undefined;
}, e.clearAnimation = function() {
e.interval && window.clearInterval(e.interval);
}, e.setAnimation = function(t) {
var n = typeof t == "function" ? t : t.callback, r = t.interval || 30, s = 0, o = 0, u = 0;
e.clearAnimation(), e.interval = window.setInterval(function() {
if (e.endTime === 0) return;
e.playing ? (s = u === e.currentTime ? o - (new Date).getTime() : 0, e.currentTime === 0 ? s = 0 : s = e.currentTime - s, u !== e.currentTime && (o = (new Date).getTime(), u = e.currentTime)) : s = e.currentTime;
var t = e.endTime, r = s / t, a = s / 1e3, f = a / 60, l = a - f * 60, c = f * 60 + l, h = t / 1e3;
if (h - c < -1) return;
n({
now: c,
end: h,
events: i
});
}, r);
}, e.loadMidiFile = function() {
e.replayer = new Replayer(MidiFile(e.currentData), e.timeWarp), e.data = e.replayer.getData(), e.endTime = a();
}, e.loadFile = function(t, n) {
e.stop();
if (t.indexOf("base64,") !== -1) {
var r = window.atob(t.split(",")[1]);
e.currentData = r, e.loadMidiFile(), n && n(r);
return;
}
var i = new XMLHttpRequest;
i.open("GET", t), i.overrideMimeType("text/plain; charset=x-user-defined"), i.onreadystatechange = function() {
if (this.readyState === 4 && this.status === 200) {
var t = this.responseText || "", r = [], i = t.length, s = String.fromCharCode;
for (var o = 0; o < i; o++) r[o] = s(t.charCodeAt(o) & 255);
var u = r.join("");
e.currentData = u, e.loadMidiFile(), n && n(u);
}
}, i.send();
};
var t = [], n, r = 0, i = {}, s = undefined, o = function(t, r, o, u, a, l) {
var c = window.setTimeout(function() {
var u = {
channel: t,
note: r,
now: o,
end: e.endTime,
message: a,
velocity: l
};
a === 128 ? delete i[r] : i[r] = u, s && s(u), e.currentTime = o, e.currentTime === n && n < e.endTime && f(n, !0);
}, o - u);
return c;
}, u = function() {
return MIDI.lang === "WebAudioAPI" ? MIDI.Player.ctx : (e.ctx || (e.ctx = {
currentTime: 0
}), e.ctx);
}, a = function() {
var t = e.data, n = t.length, r = .5;
for (var i = 0; i < n; i++) r += t[i][1];
return r;
}, f = function(i, s) {
if (!e.replayer) return;
s || (typeof i == "undefined" && (i = e.restart), e.playing && l(), e.playing = !0, e.data = e.replayer.getData(), e.endTime = a());
var f, c = 0, h = 0, p = e.data, d = u(), v = p.length;
n = .5, r = d.currentTime;
for (var m = 0; m < v && h < 100; m++) {
n += p[m][1];
if (n < i) {
c = n;
continue;
}
i = n - c;
var g = p[m][0].event;
if (g.type !== "channel") continue;
var y = g.channel;
switch (g.subtype) {
case "noteOn":
if (MIDI.channels[y].mute) break;
f = g.noteNumber - (e.MIDIOffset || 0), t.push({
event: g,
source: MIDI.noteOn(y, g.noteNumber, g.velocity, i / 1e3 + d.currentTime),
interval: o(y, f, n, c, 144, g.velocity)
}), h++;
break;
case "noteOff":
if (MIDI.channels[y].mute) break;
f = g.noteNumber - (e.MIDIOffset || 0), t.push({
event: g,
source: MIDI.noteOff(y, g.noteNumber, i / 1e3 + d.currentTime),
interval: o(y, f, n, c, 128)
});
break;
default:
}
}
}, l = function() {
var n = u();
e.playing = !1, e.restart += (n.currentTime - r) * 1e3;
while (t.length) {
var o = t.pop();
window.clearInterval(o.interval);
if (!o.source) continue;
if (typeof o.source == "number") window.clearTimeout(o.source); else {
var a = o.source;
a.disconnect(0), a.noteOff(0);
}
}
for (var f in i) {
var o = i[f];
i[f].message === 144 && s && s({
channel: o.channel,
note: o.note,
now: o.now,
end: o.end,
message: 128,
velocity: o.velocity
});
}
i = {};
};
}();

// Midi/js/Window/Event.js

if (typeof Event == "undefined") var Event = {};

if (typeof eventjs == "undefined") var eventjs = Event;

Event = function(e) {
"use strict";
e.modifyEventListener = !1, e.modifySelectors = !1, e.add = function(e, t, r, i) {
return n(e, t, r, i, "add");
}, e.remove = function(e, t, r, i) {
return n(e, t, r, i, "remove");
}, e.stop = function(e) {
e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0, e.bubble = 0;
}, e.prevent = function(e) {
e.preventDefault && e.preventDefault(), e.returnValue = !1;
}, e.cancel = function(t) {
e.stop(t), e.prevent(t);
}, e.supports = function(e, t) {
typeof e == "string" && (t = e, e = window), t = "on" + t;
if (t in e) return !0;
e.setAttribute || (e = document.createElement("div"));
if (e.setAttribute && e.removeAttribute) {
e.setAttribute(t, "");
var n = typeof e[t] == "function";
return typeof e[t] != "undefined" && (e[t] = null), e.removeAttribute(t), n;
}
};
var t = function(e) {
if (!e || typeof e != "object") return e;
var n = new e.constructor;
for (var r in e) !e[r] || typeof e[r] != "object" ? n[r] = e[r] : n[r] = t(e[r]);
return n;
}, n = function(u, c, h, p, d, v) {
p = p || {};
if (typeof u == "string" && c === "ready") {
var m = (new Date).getTime(), g = p.timeout, y = p.interval || 1e3 / 60, b = window.setInterval(function() {
(new Date).getTime() - m > g && window.clearInterval(b), document.querySelector(u) && (window.clearInterval(b), h());
}, y);
return;
}
if (typeof u == "string") {
u = document.querySelectorAll(u);
if (u.length === 0) return i("Missing target on listener!");
u.length === 1 && (u = u[0]);
}
var w, E = {};
if (u.length > 0 && u !== window) {
for (var S = 0, x = u.length; S < x; S++) w = n(u[S], c, h, t(p), d), w && (E[S] = w);
return r(E);
}
c.indexOf && c.indexOf(" ") !== -1 && (c = c.split(" ")), c.indexOf && c.indexOf(",") !== -1 && (c = c.split(","));
if (typeof c != "string") {
if (typeof c.length == "number") for (var T = 0, N = c.length; T < N; T++) w = n(u, c[T], h, t(p), d), w && (E[c[T]] = w); else for (var C in c) typeof c[C] == "function" ? w = n(u, C, c[C], t(p), d) : w = n(u, C, c[C].listener, t(c[C]), d), w && (E[C] = w);
return r(E);
}
if (typeof h != "function") return i("Listener is not a function!");
var k = p.useCapture || !1, L = s(c) + a(u) + "." + a(h) + "." + (k ? 1 : 0);
if (e.Gesture && e.Gesture._gestureHandlers[c]) {
if (d === "remove") {
if (!o[L]) return;
o[L].remove(), delete o[L];
} else if (d === "add") {
if (o[L]) return o[L];
if (p.useCall && !e.modifyEventListener) {
var A = h;
h = function(e, t) {
for (var n in t) e[n] = t[n];
return A.call(u, e);
};
}
p.gesture = c, p.target = u, p.listener = h, p.fromOverwrite = v, o[L] = e.proxy[c](p);
}
} else {
c = s(c);
if (d === "remove") {
if (!o[L]) return;
u[l](c, h, k), delete o[L];
} else if (d === "add") {
if (o[L]) return o[L];
u[f](c, h, k), o[L] = {
type: c,
target: u,
listener: h,
remove: function() {
e.remove(u, c, h, p);
}
};
}
}
return o[L];
}, r = function(e) {
return {
remove: function() {
for (var t in e) e[t].remove();
},
add: function() {
for (var t in e) e[t].add();
}
};
}, i = function(e) {
if (typeof console == "undefined") return;
if (typeof console.error == "undefined") return;
console.error(e);
}, s = function() {
var t = {};
return function(n) {
return e.pointerType || (window.navigator.msPointerEnabled ? (e.pointerType = "mspointer", t = {
mousedown: "MSPointerDown",
mousemove: "MSPointerMove",
mouseup: "MSPointerUp"
}) : e.supports("touchstart") ? (e.pointerType = "touch", t = {
mousedown: "touchstart",
mouseup: "touchend",
mousemove: "touchmove"
}) : e.pointerType = "mouse"), t[n] && (n = t[n]), document.addEventListener ? n : "on" + n;
};
}(), o = {}, u = 0, a = function(e) {
return e === window ? "#window" : e === document ? "#document" : e ? (e.uniqueID || (e.uniqueID = "id" + u++), e.uniqueID) : i("Missing target on listener!");
}, f = document.addEventListener ? "addEventListener" : "attachEvent", l = document.removeEventListener ? "removeEventListener" : "detachEvent";
return e.createPointerEvent = function(t, n, r) {
var i = n.gesture, s = n.target, o = t.changedTouches || e.proxy.getCoords(t);
if (o.length) {
var u = o[0];
n.pointers = r ? [] : o, n.pageX = u.pageX, n.pageY = u.pageY, n.x = n.pageX, n.y = n.pageY;
}
var a = document.createEvent("Event");
a.initEvent(i, !0, !0), a.originalEvent = t;
for (var f in n) {
if (f === "target") continue;
a[f] = n[f];
}
s.dispatchEvent(a);
}, e.modifyEventListener && window.HTMLElement && function() {
var t = function(t) {
var r = function(r) {
var i = r + "EventListener", o = t[i];
t[i] = function(t, i, u) {
if (e.Gesture && e.Gesture._gestureHandlers[t]) {
var a = u;
typeof u == "object" ? a.useCall = !0 : a = {
useCall: !0,
useCapture: u
}, n(this, t, i, a, r, !0), o.call(this, t, i, u);
} else o.call(this, s(t), i, u);
};
};
r("add"), r("remove");
};
navigator.userAgent.match(/Firefox/) ? (t(HTMLDivElement.prototype), t(HTMLCanvasElement.prototype)) : t(HTMLElement.prototype), t(document), t(window);
}(), e.modifySelectors && function() {
var e = NodeList.prototype;
e.removeEventListener = function(e, t, n) {
for (var r = 0, i = this.length; r < i; r++) this[r].removeEventListener(e, t, n);
}, e.addEventListener = function(e, t, n) {
for (var r = 0, i = this.length; r < i; r++) this[r].addEventListener(e, t, n);
};
}(), e;
}(Event);

if (typeof Event == "undefined") var Event = {};

typeof Event.proxy == "undefined" && (Event.proxy = {}), Event.proxy = function(e) {
"use strict";
return e.pointerSetup = function(e, t) {
e.doc = e.target.ownerDocument || e.target, e.minFingers = e.minFingers || e.fingers || 1, e.maxFingers = e.maxFingers || e.fingers || Infinity, e.position = e.position || "relative", delete e.fingers, t = t || {}, t.gesture = e.gesture, t.target = e.target, t.pointerType = Event.pointerType, Event.modifyEventListener && e.fromOverwrite && (e.listener = Event.createPointerEvent);
var n = 0, r = t.gesture.indexOf("pointer") === 0 && Event.modifyEventListener ? "pointer" : "mouse";
return t.listener = e.listener, t.proxy = function(n) {
t.defaultListener = e.listener, e.listener = n, n(e.event, t);
}, t.attach = function() {
e.onPointerDown && Event.add(e.target, r + "down", e.onPointerDown), e.onPointerMove && Event.add(e.doc, r + "move", e.onPointerMove), e.onPointerUp && Event.add(e.doc, r + "up", e.onPointerUp);
}, t.remove = function() {
e.onPointerDown && Event.remove(e.target, r + "down", e.onPointerDown), e.onPointerMove && Event.remove(e.doc, r + "move", e.onPointerMove), e.onPointerUp && Event.remove(e.doc, r + "up", e.onPointerUp), t.reset();
}, t.pause = function(t) {
e.onPointerMove && (!t || t.move) && Event.remove(e.doc, r + "move", e.onPointerMove), e.onPointerUp && (!t || t.up) && Event.remove(e.doc, r + "up", e.onPointerUp), n = e.fingers, e.fingers = 0;
}, t.resume = function(t) {
e.onPointerMove && (!t || t.move) && Event.add(e.doc, r + "move", e.onPointerMove), e.onPointerUp && (!t || t.up) && Event.add(e.doc, r + "up", e.onPointerUp), e.fingers = n;
}, t.reset = function() {
delete e.tracker, e.fingers = 0;
}, t;
}, e.pointerStart = function(t, n, r) {
var i = function(e, t) {
var n = r.bbox, i = o[t] = {};
switch (r.position) {
case "absolute":
i.offsetX = 0, i.offsetY = 0;
break;
case "difference":
i.offsetX = e.pageX, i.offsetY = e.pageY;
break;
case "move":
i.offsetX = e.pageX - n.x1, i.offsetY = e.pageY - n.y1;
break;
default:
i.offsetX = n.x1, i.offsetY = n.y1;
}
if (r.position === "relative") var s = (e.pageX + n.scrollLeft - i.offsetX) * n.scaleX, u = (e.pageY + n.scrollTop - i.offsetY) * n.scaleY; else var s = e.pageX - i.offsetX, u = e.pageY - i.offsetY;
i.rotation = 0, i.scale = 1, i.startTime = i.moveTime = (new Date).getTime(), i.move = {
x: s,
y: u
}, i.start = {
x: s,
y: u
}, r.fingers++;
};
r.event = t, n.defaultListener && (r.listener = n.defaultListener, delete n.defaultListener);
var s = !r.fingers, o = r.tracker, u = t.changedTouches || e.getCoords(t), a = u.length;
for (var f = 0; f < a; f++) {
var l = u[f], c = l.identifier || Infinity;
if (r.fingers) {
if (r.fingers >= r.maxFingers) {
var h = [];
for (var c in r.tracker) h.push(c);
return n.identifier = h.join(","), s;
}
var p = 0;
for (var d in o) {
if (o[d].up) {
delete o[d], i(l, c), r.cancel = !0;
break;
}
p++;
}
if (o[c]) continue;
i(l, c);
} else o = r.tracker = {}, n.bbox = r.bbox = e.getBoundingBox(r.target), r.fingers = 0, r.cancel = !1, i(l, c);
}
var h = [];
for (var c in r.tracker) h.push(c);
return n.identifier = h.join(","), s;
}, e.pointerEnd = function(e, t, n, r) {
var i = e.touches || [], s = i.length, o = {};
for (var u = 0; u < s; u++) {
var a = i[u], f = a.identifier;
o[f || Infinity] = !0;
}
for (var f in n.tracker) {
var l = n.tracker[f];
if (o[f] || l.up) continue;
r && r({
pageX: l.pageX,
pageY: l.pageY,
changedTouches: [ {
pageX: l.pageX,
pageY: l.pageY,
identifier: f === "Infinity" ? Infinity : f
} ]
}, "up"), l.up = !0, n.fingers--;
}
if (n.fingers !== 0) return !1;
var c = [];
n.gestureFingers = 0;
for (var f in n.tracker) n.gestureFingers++, c.push(f);
return t.identifier = c.join(","), !0;
}, e.getCoords = function(t) {
return typeof t.pageX != "undefined" ? e.getCoords = function(e) {
return Array({
type: "mouse",
x: e.pageX,
y: e.pageY,
pageX: e.pageX,
pageY: e.pageY,
identifier: Infinity
});
} : e.getCoords = function(e) {
return e = e || window.event, Array({
type: "mouse",
x: e.clientX + document.documentElement.scrollLeft,
y: e.clientY + document.documentElement.scrollTop,
pageX: e.clientX + document.documentElement.scrollLeft,
pageY: e.clientY + document.documentElement.scrollTop,
identifier: Infinity
});
}, e.getCoords(t);
}, e.getCoord = function(t) {
if ("ontouchstart" in window) {
var n = 0, r = 0;
e.getCoord = function(e) {
var t = e.changedTouches;
return t.length ? {
x: n = t[0].pageX,
y: r = t[0].pageY
} : {
x: n,
y: r
};
};
} else typeof t.pageX != "undefined" && typeof t.pageY != "undefined" ? e.getCoord = function(e) {
return {
x: e.pageX,
y: e.pageY
};
} : e.getCoord = function(e) {
return e = e || window.event, {
x: e.clientX + document.documentElement.scrollLeft,
y: e.clientY + document.documentElement.scrollTop
};
};
return e.getCoord(t);
}, e.getBoundingBox = function(e) {
if (e === window || e === document) e = document.body;
var t = {
x1: 0,
y1: 0,
x2: 0,
y2: 0,
scrollLeft: 0,
scrollTop: 0
};
e === document.body ? (t.height = window.innerHeight, t.width = window.innerWidth) : (t.height = e.offsetHeight, t.width = e.offsetWidth), t.scaleX = e.width / t.width || 1, t.scaleY = e.height / t.height || 1;
var n = e;
while (n !== null) t.x1 += n.offsetLeft, t.y1 += n.offsetTop, n = n.offsetParent;
var n = e.parentNode;
while (n !== null) {
if (n === document.body) break;
if (n.scrollTop === undefined) break;
t.scrollLeft += n.scrollLeft, t.scrollTop += n.scrollTop, n = n.parentNode;
}
return t.x2 = t.x1 + t.width, t.y2 = t.y1 + t.height, t;
}, function() {
var t = navigator.userAgent.toLowerCase(), n = t.indexOf("macintosh") !== -1;
if (n && t.indexOf("khtml") !== -1) var r = {
91: !0,
93: !0
}; else if (n && t.indexOf("firefox") !== -1) var r = {
224: !0
}; else var r = {
17: !0
};
e.isMetaKey = function(e) {
return !!r[e.keyCode];
}, e.metaTracker = function(t) {
r[t.keyCode] && (e.metaKey = t.type === "keydown");
};
}(), e;
}(Event.proxy);

if (typeof Event == "undefined") var Event = {};

typeof Event.proxy == "undefined" && (Event.proxy = {}), Event.proxy = function(e) {
"use strict";
return e.click = function(t) {
t.maxFingers = t.maxFingers || t.fingers || 1;
var n;
t.onPointerDown = function(n) {
e.pointerStart(n, r, t) && (Event.add(t.doc, "mousemove", t.onPointerMove).listener(n), Event.add(t.doc, "mouseup", t.onPointerUp));
}, t.onPointerMove = function(e) {
n = e;
}, t.onPointerUp = function(i) {
if (e.pointerEnd(i, r, t)) {
Event.remove(t.doc, "mousemove", t.onPointerMove), Event.remove(t.doc, "mouseup", t.onPointerUp);
if (n.cancelBubble && ++n.bubble > 1) return;
var s = n.changedTouches || e.getCoords(n), o = s[0], u = t.bbox, a = e.getBoundingBox(t.target);
if (t.position === "relative") var f = (o.pageX + u.scrollLeft - u.x1) * u.scaleX, l = (o.pageY + u.scrollTop - u.y1) * u.scaleY; else var f = o.pageX - u.x1, l = o.pageY - u.y1;
f > 0 && f < u.width && l > 0 && l < u.height && u.scrollTop === a.scrollTop && t.listener(n, r);
}
};
var r = e.pointerSetup(t);
return r.state = "click", Event.add(t.target, "mousedown", t.onPointerDown), r;
}, Event.Gesture = Event.Gesture || {}, Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {}, Event.Gesture._gestureHandlers.click = e.click, e;
}(Event.proxy);

if (typeof Event == "undefined") var Event = {};

typeof Event.proxy == "undefined" && (Event.proxy = {}), Event.proxy = function(e) {
"use strict";
return e.dbltap = e.dblclick = function(t) {
t.maxFingers = t.maxFingers || t.fingers || 1;
var n = 700, r, i, s, o, u;
t.onPointerDown = function(f) {
var l = f.changedTouches || e.getCoords(f);
r && !i ? (u = l[0], i = (new Date).getTime() - r) : (o = l[0], r = (new Date).getTime(), i = 0, clearTimeout(s), s = setTimeout(function() {
r = 0;
}, n)), e.pointerStart(f, a, t) && (Event.add(t.doc, "mousemove", t.onPointerMove).listener(f), Event.add(t.doc, "mouseup", t.onPointerUp));
}, t.onPointerMove = function(n) {
if (r && !i) {
var a = n.changedTouches || e.getCoords(n);
u = a[0];
}
var f = t.bbox;
if (t.position === "relative") var l = (u.pageX + f.scrollLeft - f.x1) * f.scaleX, c = (u.pageY + f.scrollTop - f.y1) * f.scaleY; else var l = u.pageX - f.x1, c = u.pageY - f.y1;
l > 0 && l < f.width && c > 0 && c < f.height && Math.abs(u.pageX - o.pageX) <= 25 && Math.abs(u.pageY - o.pageY) <= 25 || (Event.remove(t.doc, "mousemove", t.onPointerMove), clearTimeout(s), r = i = 0);
}, t.onPointerUp = function(o) {
e.pointerEnd(o, a, t) && (Event.remove(t.doc, "mousemove", t.onPointerMove), Event.remove(t.doc, "mouseup", t.onPointerUp)), r && i && (i <= n && !(o.cancelBubble && ++o.bubble > 1) && (a.state = t.gesture, t.listener(o, a)), clearTimeout(s), r = i = 0);
};
var a = e.pointerSetup(t);
return a.state = "dblclick", Event.add(t.target, "mousedown", t.onPointerDown), a;
}, Event.Gesture = Event.Gesture || {}, Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {}, Event.Gesture._gestureHandlers.dbltap = e.dbltap, Event.Gesture._gestureHandlers.dblclick = e.dblclick, e;
}(Event.proxy);

if (typeof Event == "undefined") var Event = {};

typeof Event.proxy == "undefined" && (Event.proxy = {}), Event.proxy = function(e) {
"use strict";
return e.dragElement = function(t, n) {
e.drag({
event: n,
target: t,
position: "move",
listener: function(e, n) {
t.style.left = n.x + "px", t.style.top = n.y + "px", Event.prevent(e);
}
});
}, e.drag = function(t) {
t.gesture = "drag", t.onPointerDown = function(r) {
e.pointerStart(r, n, t) && (t.monitor || (Event.add(t.doc, "mousemove", t.onPointerMove), Event.add(t.doc, "mouseup", t.onPointerUp))), t.onPointerMove(r, "down");
}, t.onPointerMove = function(r, i) {
if (!t.tracker) return t.onPointerDown(r);
var s = t.bbox, o = r.changedTouches || e.getCoords(r), u = o.length;
for (var a = 0; a < u; a++) {
var f = o[a], l = f.identifier || Infinity, c = t.tracker[l];
if (!c) continue;
c.pageX = f.pageX, c.pageY = f.pageY, n.state = i || "move", n.identifier = l, n.start = c.start, n.fingers = t.fingers, t.position === "relative" ? (n.x = (c.pageX + s.scrollLeft - c.offsetX) * s.scaleX, n.y = (c.pageY + s.scrollTop - c.offsetY) * s.scaleY) : (n.x = c.pageX - c.offsetX, n.y = c.pageY - c.offsetY), t.listener(r, n);
}
}, t.onPointerUp = function(r) {
e.pointerEnd(r, n, t, t.onPointerMove) && (t.monitor || (Event.remove(t.doc, "mousemove", t.onPointerMove), Event.remove(t.doc, "mouseup", t.onPointerUp)));
};
var n = e.pointerSetup(t);
return t.event ? t.onPointerDown(t.event) : (Event.add(t.target, "mousedown", t.onPointerDown), t.monitor && (Event.add(t.doc, "mousemove", t.onPointerMove), Event.add(t.doc, "mouseup", t.onPointerUp))), n;
}, Event.Gesture = Event.Gesture || {}, Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {}, Event.Gesture._gestureHandlers.drag = e.drag, e;
}(Event.proxy);

if (typeof Event == "undefined") var Event = {};

typeof Event.proxy == "undefined" && (Event.proxy = {}), Event.proxy = function(e) {
"use strict";
var t = Math.PI / 180;
return e.gesture = function(n) {
n.minFingers = n.minFingers || n.fingers || 2, n.onPointerDown = function(t) {
var i = n.fingers;
e.pointerStart(t, r, n) && (Event.add(n.doc, "mousemove", n.onPointerMove), Event.add(n.doc, "mouseup", n.onPointerUp));
if (n.fingers === n.minFingers && i !== n.fingers) {
r.fingers = n.minFingers, r.scale = 1, r.rotation = 0, r.state = "start";
var s = "";
for (var o in n.tracker) s += o;
r.identifier = parseInt(s), n.listener(t, r);
}
}, n.onPointerMove = function(i, s) {
var o = n.bbox, u = n.tracker, a = i.changedTouches || e.getCoords(i), f = a.length;
for (var l = 0; l < f; l++) {
var c = a[l], h = c.identifier || Infinity, p = u[h];
if (!p) continue;
n.position === "relative" ? (p.move.x = (c.pageX + o.scrollLeft - o.x1) * o.scaleX, p.move.y = (c.pageY + o.scrollTop - o.y1) * o.scaleY) : (p.move.x = c.pageX - o.x1, p.move.y = c.pageY - o.y1);
}
if (n.fingers < n.minFingers) return;
var a = [], d = 0, v = 0, m = 0, g = 0, f = 0;
for (var h in u) {
var c = u[h];
if (c.up) continue;
m += c.move.x, g += c.move.y, f++;
}
m /= f, g /= f;
for (var h in u) {
var c = u[h];
if (c.up) continue;
var y = c.start;
if (!y.distance) {
var b = y.x - m, w = y.y - g;
y.distance = Math.sqrt(b * b + w * w), y.angle = Math.atan2(b, w) / t;
}
var b = c.move.x - m, w = c.move.y - g, E = Math.sqrt(b * b + w * w);
d += E / y.distance;
var S = Math.atan2(b, w) / t, x = (y.angle - S + 360) % 360 - 180;
c.DEG2 = c.DEG1, c.DEG1 = x > 0 ? x : -x, typeof c.DEG2 != "undefined" && (x > 0 ? c.rotation += c.DEG1 - c.DEG2 : c.rotation -= c.DEG1 - c.DEG2, v += c.rotation), a.push(c.move);
}
r.touches = a, r.fingers = n.fingers, r.scale = d / n.fingers, r.rotation = v / n.fingers, r.state = "change", n.listener(i, r);
}, n.onPointerUp = function(t) {
var i = n.fingers;
e.pointerEnd(t, r, n) && (Event.remove(n.doc, "mousemove", n.onPointerMove), Event.remove(n.doc, "mouseup", n.onPointerUp)), i === n.minFingers && n.fingers < n.minFingers && (r.fingers = n.fingers, r.state = "end", n.listener(t, r));
};
var r = e.pointerSetup(n);
return Event.add(n.target, "mousedown", n.onPointerDown), r;
}, Event.Gesture = Event.Gesture || {}, Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {}, Event.Gesture._gestureHandlers.gesture = e.gesture, e;
}(Event.proxy);

if (typeof Event == "undefined") var Event = {};

typeof Event.proxy == "undefined" && (Event.proxy = {}), Event.proxy = function(e) {
"use strict";
return e.pointerdown = e.pointermove = e.pointerup = function(t) {
if (t.target.isPointerEmitter) return;
var n = !0;
t.onPointerDown = function(e) {
n = !1, r.gesture = "pointerdown", t.listener(e, r);
}, t.onPointerMove = function(e) {
r.gesture = "pointermove", t.listener(e, r, n);
}, t.onPointerUp = function(e) {
n = !0, r.gesture = "pointerup", t.listener(e, r, !0);
};
var r = e.pointerSetup(t);
return Event.add(t.target, "mousedown", t.onPointerDown), Event.add(t.target, "mousemove", t.onPointerMove), Event.add(t.doc, "mouseup", t.onPointerUp), t.target.isPointerEmitter = !0, r;
}, Event.Gesture = Event.Gesture || {}, Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {}, Event.Gesture._gestureHandlers.pointerdown = e.pointerdown, Event.Gesture._gestureHandlers.pointermove = e.pointermove, Event.Gesture._gestureHandlers.pointerup = e.pointerup, e;
}(Event.proxy);

if (typeof Event == "undefined") var Event = {};

typeof Event.proxy == "undefined" && (Event.proxy = {}), Event.proxy = function(e) {
"use strict";
return e.shake = function(e) {
var t = {
gesture: "devicemotion",
acceleration: {},
accelerationIncludingGravity: {},
target: e.target,
listener: e.listener,
remove: function() {
window.removeEventListener("devicemotion", f, !1);
}
}, n = 4, r = 1e3, i = 200, s = 3, o = (new Date).getTime(), u = {
x: 0,
y: 0,
z: 0
}, a = {
x: {
count: 0,
value: 0
},
y: {
count: 0,
value: 0
},
z: {
count: 0,
value: 0
}
}, f = function(f) {
var l = .8, c = f.accelerationIncludingGravity;
u.x = l * u.x + (1 - l) * c.x, u.y = l * u.y + (1 - l) * c.y, u.z = l * u.z + (1 - l) * c.z, t.accelerationIncludingGravity = u, t.acceleration.x = c.x - u.x, t.acceleration.y = c.y - u.y, t.acceleration.z = c.z - u.z;
if (e.gesture === "devicemotion") {
e.listener(f, t);
return;
}
var h = "xyz", p = (new Date).getTime();
for (var d = 0, v = h.length; d < v; d++) {
var m = h[d], g = t.acceleration[m], y = a[m], b = Math.abs(g);
if (p - o < r) continue;
if (b > n) {
var w = p * g / b, E = Math.abs(w + y.value);
y.value && E < i ? (y.value = w, y.count++, y.count === s && (e.listener(f, t), o = p, y.value = 0, y.count = 0)) : (y.value = w, y.count = 1);
}
}
};
if (!window.addEventListener) return;
return window.addEventListener("devicemotion", f, !1), t;
}, Event.Gesture = Event.Gesture || {}, Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {}, Event.Gesture._gestureHandlers.shake = e.shake, e;
}(Event.proxy);

if (typeof Event == "undefined") var Event = {};

typeof Event.proxy == "undefined" && (Event.proxy = {}), Event.proxy = function(e) {
"use strict";
var t = Math.PI / 180;
return e.swipe = function(n) {
n.snap = n.snap || 90, n.threshold = n.threshold || 1, n.onPointerDown = function(t) {
e.pointerStart(t, r, n) && (Event.add(n.doc, "mousemove", n.onPointerMove).listener(t), Event.add(n.doc, "mouseup", n.onPointerUp));
}, n.onPointerMove = function(t) {
var r = t.changedTouches || e.getCoords(t), i = r.length;
for (var s = 0; s < i; s++) {
var o = r[s], u = o.identifier || Infinity, a = n.tracker[u];
if (!a) continue;
a.move.x = o.pageX, a.move.y = o.pageY, a.moveTime = (new Date).getTime();
}
}, n.onPointerUp = function(i) {
if (e.pointerEnd(i, r, n)) {
Event.remove(n.doc, "mousemove", n.onPointerMove), Event.remove(n.doc, "mouseup", n.onPointerUp);
var s, o, u, a, f = {
x: 0,
y: 0
}, l = 0, c = 0, h = 0;
for (var p in n.tracker) {
var d = n.tracker[p], v = d.move.x - d.start.x, m = d.move.y - d.start.y;
l += d.move.x, c += d.move.y, f.x += d.start.x, f.y += d.start.y, h++;
var g = Math.sqrt(v * v + m * m), y = d.moveTime - d.startTime, a = Math.atan2(v, m) / t + 180, o = y ? g / y : 0;
if (typeof u == "undefined") u = a, s = o; else {
if (!(Math.abs(a - u) <= 20)) return;
u = (u + a) / 2, s = (s + o) / 2;
}
}
s > n.threshold && (f.x /= h, f.y /= h, r.start = f, r.x = l / h, r.y = c / h, r.angle = -(((u / n.snap + .5 >> 0) * n.snap || 360) - 360), r.velocity = s, r.fingers = n.gestureFingers, r.state = "swipe", n.listener(i, r));
}
};
var r = e.pointerSetup(n);
return Event.add(n.target, "mousedown", n.onPointerDown), r;
}, Event.Gesture = Event.Gesture || {}, Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {}, Event.Gesture._gestureHandlers.swipe = e.swipe, e;
}(Event.proxy);

if (typeof Event == "undefined") var Event = {};

typeof Event.proxy == "undefined" && (Event.proxy = {}), Event.proxy = function(e) {
"use strict";
return e.tap = e.longpress = function(t) {
t.delay = t.delay || 500, t.timeout = t.timeout || 250;
var n, r;
t.onPointerDown = function(s) {
if (e.pointerStart(s, i, t)) {
n = (new Date).getTime(), Event.add(t.doc, "mousemove", t.onPointerMove).listener(s), Event.add(t.doc, "mouseup", t.onPointerUp);
if (t.gesture !== "longpress") return;
r = setTimeout(function() {
if (s.cancelBubble && ++s.bubble > 1) return;
var e = 0;
for (var n in t.tracker) {
if (t.tracker[n].end === !0) return;
if (t.cancel) return;
e++;
}
i.state = "start", i.fingers = e, t.listener(s, i);
}, t.delay);
}
}, t.onPointerMove = function(n) {
var r = t.bbox, i = n.changedTouches || e.getCoords(n), s = i.length;
for (var o = 0; o < s; o++) {
var u = i[o], a = u.identifier || Infinity, f = t.tracker[a];
if (!f) continue;
if (t.position === "relative") var l = (u.pageX + r.scrollLeft - r.x1) * r.scaleX, c = (u.pageY + r.scrollTop - r.y1) * r.scaleY; else var l = u.pageX - r.x1, c = u.pageY - r.y1;
if (!(l > 0 && l < r.width && c > 0 && c < r.height && Math.abs(l - f.start.x) <= 25 && Math.abs(c - f.start.y) <= 25)) {
Event.remove(t.doc, "mousemove", t.onPointerMove), t.cancel = !0;
return;
}
}
}, t.onPointerUp = function(s) {
if (e.pointerEnd(s, i, t)) {
clearTimeout(r), Event.remove(t.doc, "mousemove", t.onPointerMove), Event.remove(t.doc, "mouseup", t.onPointerUp);
if (s.cancelBubble && ++s.bubble > 1) return;
if (t.gesture === "longpress") {
i.state === "start" && (i.state = "end", t.listener(s, i));
return;
}
if (t.cancel) return;
if ((new Date).getTime() - n > t.timeout) return;
i.state = "tap", i.fingers = t.gestureFingers, t.listener(s, i);
}
};
var i = e.pointerSetup(t);
return Event.add(t.target, "mousedown", t.onPointerDown), i;
}, Event.Gesture = Event.Gesture || {}, Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {}, Event.Gesture._gestureHandlers.tap = e.tap, Event.Gesture._gestureHandlers.longpress = e.longpress, e;
}(Event.proxy);

if (typeof Event == "undefined") var Event = {};

typeof Event.proxy == "undefined" && (Event.proxy = {}), Event.proxy = function(e) {
"use strict";
return e.wheel = function(e) {
var t, n = e.timeout || 150, r = 0, i = {
gesture: "wheel",
state: "start",
wheelDelta: 0,
target: e.target,
listener: e.listener,
remove: function() {
e.target[u](a, s, !1);
}
}, s = function(s) {
s = s || window.event, i.state = r++ ? "change" : "start", i.wheelDelta = s.detail ? s.detail * -20 : s.wheelDelta, e.listener(s, i), clearTimeout(t), t = setTimeout(function() {
r = 0, i.state = "end", i.wheelDelta = 0, e.listener(s, i);
}, n);
}, o = document.addEventListener ? "addEventListener" : "attachEvent", u = document.removeEventListener ? "removeEventListener" : "detachEvent", a = Event.supports("mousewheel") ? "mousewheel" : "DOMMouseScroll";
return e.target[o](a, s, !1), i;
}, Event.Gesture = Event.Gesture || {}, Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {}, Event.Gesture._gestureHandlers.wheel = e.wheel, e;
}(Event.proxy);

// Midi/js/Window/DOMLoader.XMLHttp.js

if (typeof DOMLoader == "undefined") var DOMLoader = {};

if (typeof XMLHttpRequest == "undefined") {
var XMLHttpRequest;
(function() {
var e = [ function() {
return new ActiveXObject("Msxml2.XMLHTTP");
}, function() {
return new ActiveXObject("Msxml3.XMLHTTP");
}, function() {
return new ActiveXObject("Microsoft.XMLHTTP");
} ];
for (var t = 0; t < e.length; t++) {
try {
e[t]();
} catch (n) {
continue;
}
break;
}
XMLHttpRequest = e[t];
})();
}

if (typeof (new XMLHttpRequest).responseText == "undefined") {
var IEBinaryToArray_ByteStr_Script = "<!-- IEBinaryToArray_ByteStr -->\r\n<script type='text/vbscript'>\r\nFunction IEBinaryToArray_ByteStr(Binary)\r\n   IEBinaryToArray_ByteStr = CStr(Binary)\r\nEnd Function\r\nFunction IEBinaryToArray_ByteStr_Last(Binary)\r\n   Dim lastIndex\r\n   lastIndex = LenB(Binary)\r\n   if lastIndex mod 2 Then\r\n       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n   Else\r\n       IEBinaryToArray_ByteStr_Last = \"\"\r\n   End If\r\nEnd Function\r\n</script>\r\n";
document.write(IEBinaryToArray_ByteStr_Script), DOMLoader.sendRequest = function(e) {
function t(e) {
var t = {};
for (var n = 0; n < 256; n++) for (var r = 0; r < 256; r++) t[String.fromCharCode(n + r * 256)] = String.fromCharCode(n) + String.fromCharCode(r);
var i = IEBinaryToArray_ByteStr(e), s = IEBinaryToArray_ByteStr_Last(e);
return i.replace(/[\s\S]/g, function(e) {
return t[e];
}) + s;
}
var n = XMLHttpRequest();
return n.open("GET", e.url, !0), e.responseType && (n.responseType = e.responseType), e.onerror && (n.onerror = e.onerror), e.onprogress && (n.onprogress = e.onprogress), n.onreadystatechange = function(r) {
n.readyState === 4 && (n.status === 200 ? n.responseText = t(n.responseBody) : n = !1, e.onload && e.onload(n));
}, n.setRequestHeader("Accept-Charset", "x-user-defined"), n.send(null), n;
};
} else DOMLoader.sendRequest = function(e) {
var t = new XMLHttpRequest;
return t.open(e.data ? "POST" : "GET", e.url, !0), t.overrideMimeType && t.overrideMimeType("text/plain; charset=x-user-defined"), e.data && t.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), e.responseType && (t.responseType = e.responseType), e.onerror && (t.onerror = e.onerror), e.onprogress && (t.onprogress = e.onprogress), t.onreadystatechange = function(n) {
if (t.readyState === 4) {
if (t.status !== 200 && t.status != 304) {
e.onerror && e.onerror(n, !1);
return;
}
e.onload && e.onload(t);
}
}, t.send(e.data), t;
};

// Midi/js/Window/DOMLoader.script.js

if (typeof DOMLoader == "undefined") var DOMLoader = {};

(function() {
"use strict";
DOMLoader.script = function() {
return this.loaded = {}, this.loading = {}, this;
}, DOMLoader.script.prototype.add = function(e) {
var t = this;
typeof e == "string" && (e = {
src: e
});
var n = e.srcs;
typeof n == "undefined" && (n = [ {
src: e.src,
verify: e.verify
} ]);
var r = document.getElementsByTagName("head")[0], i = function(e, n) {
if (t.loaded[e.src]) return;
if (n && typeof window[n] == "undefined") return;
t.loaded[e.src] = !0, t.loading[e.src] && t.loading[e.src](), delete t.loading[e.src], e.callback && e.callback(), typeof f != "undefined" && f();
}, s = [], o = function(n) {
typeof n == "string" && (n = {
src: n,
verify: e.verify
});
if (/([\w\d.])$/.test(n.verify)) {
n.test = n.verify;
if (typeof n.test == "object") for (var o in n.test) s.push(n.test[o]); else s.push(n.test);
}
if (t.loaded[n.src]) return;
var u = document.createElement("script");
u.onreadystatechange = function() {
if (this.readyState !== "loaded" && this.readyState !== "complete") return;
i(n);
}, u.onload = function() {
i(n);
}, u.onerror = function() {}, u.setAttribute("type", "text/javascript"), u.setAttribute("src", n.src), r.appendChild(u), t.loading[n.src] = function() {};
}, u = function(t) {
if (t) i(t, t.test); else for (var r = 0; r < n.length; r++) i(n[r], n[r].test);
var o = !0;
for (var r = 0; r < s.length; r++) {
var a = s[r];
if (a && a.indexOf(".") !== -1) {
a = a.split(".");
var f = window[a[0]];
if (typeof f == "undefined") continue;
a.length === 2 ? typeof f[a[1]] == "undefined" && (o = !1) : a.length === 3 && typeof f[a[1]][a[2]] == "undefined" && (o = !1);
} else typeof window[a] == "undefined" && (o = !1);
}
!e.strictOrder && o ? e.callback && e.callback() : setTimeout(function() {
u(t);
}, 10);
};
if (e.strictOrder) {
var a = -1, f = function() {
a++;
if (!n[a]) e.callback && e.callback(); else {
var r = n[a], i = r.src;
t.loading[i] ? t.loading[i] = function() {
r.callback && r.callback(), f();
} : t.loaded[i] ? f() : (o(r), u(r));
}
};
f();
} else {
for (var a = 0; a < n.length; a++) o(n[a]);
u();
}
}, DOMLoader.script = new DOMLoader.script;
})();

// Midi/inc/jasmid/stream.js

function Stream(e) {
function n(n) {
var r = e.substr(t, n);
return t += n, r;
}
function r() {
var n = (e.charCodeAt(t) << 24) + (e.charCodeAt(t + 1) << 16) + (e.charCodeAt(t + 2) << 8) + e.charCodeAt(t + 3);
return t += 4, n;
}
function i() {
var n = (e.charCodeAt(t) << 8) + e.charCodeAt(t + 1);
return t += 2, n;
}
function s(n) {
var r = e.charCodeAt(t);
return n && r > 127 && (r -= 256), t += 1, r;
}
function o() {
return t >= e.length;
}
function u() {
var e = 0;
for (;;) {
var t = s();
if (!(t & 128)) return e + t;
e += t & 127, e <<= 7;
}
}
var t = 0;
return {
eof: o,
read: n,
readInt32: r,
readInt16: i,
readInt8: s,
readVarInt: u
};
}

// Midi/inc/jasmid/midifile.js

function MidiFile(e) {
function t(e) {
var t = e.read(4), n = e.readInt32();
return {
id: t,
length: n,
data: e.read(n)
};
}
function r(e) {
var t = {};
t.deltaTime = e.readVarInt();
var r = e.readInt8();
if ((r & 240) == 240) {
if (r == 255) {
t.type = "meta";
var i = e.readInt8(), s = e.readVarInt();
switch (i) {
case 0:
t.subtype = "sequenceNumber";
if (s != 2) throw "Expected length for sequenceNumber event is 2, got " + s;
return t.number = e.readInt16(), t;
case 1:
return t.subtype = "text", t.text = e.read(s), t;
case 2:
return t.subtype = "copyrightNotice", t.text = e.read(s), t;
case 3:
return t.subtype = "trackName", t.text = e.read(s), t;
case 4:
return t.subtype = "instrumentName", t.text = e.read(s), t;
case 5:
return t.subtype = "lyrics", t.text = e.read(s), t;
case 6:
return t.subtype = "marker", t.text = e.read(s), t;
case 7:
return t.subtype = "cuePoint", t.text = e.read(s), t;
case 32:
t.subtype = "midiChannelPrefix";
if (s != 1) throw "Expected length for midiChannelPrefix event is 1, got " + s;
return t.channel = e.readInt8(), t;
case 47:
t.subtype = "endOfTrack";
if (s != 0) throw "Expected length for endOfTrack event is 0, got " + s;
return t;
case 81:
t.subtype = "setTempo";
if (s != 3) throw "Expected length for setTempo event is 3, got " + s;
return t.microsecondsPerBeat = (e.readInt8() << 16) + (e.readInt8() << 8) + e.readInt8(), t;
case 84:
t.subtype = "smpteOffset";
if (s != 5) throw "Expected length for smpteOffset event is 5, got " + s;
var o = e.readInt8();
return t.frameRate = {
0: 24,
32: 25,
64: 29,
96: 30
}[o & 96], t.hour = o & 31, t.min = e.readInt8(), t.sec = e.readInt8(), t.frame = e.readInt8(), t.subframe = e.readInt8(), t;
case 88:
t.subtype = "timeSignature";
if (s != 4) throw "Expected length for timeSignature event is 4, got " + s;
return t.numerator = e.readInt8(), t.denominator = Math.pow(2, e.readInt8()), t.metronome = e.readInt8(), t.thirtyseconds = e.readInt8(), t;
case 89:
t.subtype = "keySignature";
if (s != 2) throw "Expected length for keySignature event is 2, got " + s;
return t.key = e.readInt8(!0), t.scale = e.readInt8(), t;
case 127:
return t.subtype = "sequencerSpecific", t.data = e.read(s), t;
default:
return t.subtype = "unknown", t.data = e.read(s), t;
}
return t.data = e.read(s), t;
}
if (r == 240) {
t.type = "sysEx";
var s = e.readVarInt();
return t.data = e.read(s), t;
}
if (r == 247) {
t.type = "dividedSysEx";
var s = e.readVarInt();
return t.data = e.read(s), t;
}
throw "Unrecognised MIDI event type byte: " + r;
}
var u;
(r & 128) == 0 ? (u = r, r = n) : (u = e.readInt8(), n = r);
var a = r >> 4;
t.channel = r & 15, t.type = "channel";
switch (a) {
case 8:
return t.subtype = "noteOff", t.noteNumber = u, t.velocity = e.readInt8(), t;
case 9:
return t.noteNumber = u, t.velocity = e.readInt8(), t.velocity == 0 ? t.subtype = "noteOff" : t.subtype = "noteOn", t;
case 10:
return t.subtype = "noteAftertouch", t.noteNumber = u, t.amount = e.readInt8(), t;
case 11:
return t.subtype = "controller", t.controllerType = u, t.value = e.readInt8(), t;
case 12:
return t.subtype = "programChange", t.programNumber = u, t;
case 13:
return t.subtype = "channelAftertouch", t.amount = u, t;
case 14:
return t.subtype = "pitchBend", t.value = u + (e.readInt8() << 7), t;
default:
throw "Unrecognised MIDI event type: " + a;
}
}
var n;
stream = Stream(e);
var i = t(stream);
if (i.id != "MThd" || i.length != 6) throw "Bad .mid file - header not found";
var s = Stream(i.data), o = s.readInt16(), u = s.readInt16(), a = s.readInt16();
if (a & 32768) throw "Expressing time division in SMTPE frames is not supported yet";
ticksPerBeat = a;
var f = {
formatType: o,
trackCount: u,
ticksPerBeat: ticksPerBeat
}, l = [];
for (var c = 0; c < f.trackCount; c++) {
l[c] = [];
var h = t(stream);
if (h.id != "MTrk") throw "Unexpected chunk - expected MTrk, got " + h.id;
var p = Stream(h.data);
while (!p.eof()) {
var d = r(p);
l[c].push(d);
}
}
return {
header: f,
tracks: l
};
}

// Midi/inc/jasmid/replayer.js

function Replayer(e, t, n) {
function f() {
var t = null, n = null, i = null;
for (var s = 0; s < r.length; s++) r[s].ticksToNextEvent != null && (t == null || r[s].ticksToNextEvent < t) && (t = r[s].ticksToNextEvent, n = s, i = r[s].nextEventIndex);
if (n != null) {
var o = e.tracks[n][i];
e.tracks[n][i + 1] ? r[n].ticksToNextEvent += e.tracks[n][i + 1].deltaTime : r[n].ticksToNextEvent = null, r[n].nextEventIndex += 1;
for (var s = 0; s < r.length; s++) r[s].ticksToNextEvent != null && (r[s].ticksToNextEvent -= t);
return {
ticksToEvent: t,
event: o,
track: n
};
}
return null;
}
function h() {
function e() {
l.event.type == "meta" && l.event.subtype == "setTempo" && (i = 6e7 / l.event.microsecondsPerBeat);
if (l.ticksToEvent > 0) var e = l.ticksToEvent / s, n = e / (i / 60);
var r = n * 1e3 * t || 0;
c.push([ l, r ]), l = f();
}
if (l = f()) while (l) e(!0);
}
var r = [], i = 120, s = e.header.ticksPerBeat;
for (var o = 0; o < e.tracks.length; o++) r[o] = {
nextEventIndex: 0,
ticksToNextEvent: e.tracks[o].length ? e.tracks[o][0].deltaTime : null
};
var u, a = 0, l, c = [];
return h(), {
getData: function() {
return clone(c);
}
};
}

var clone = function(e) {
if (typeof e != "object") return e;
if (e == null) return e;
var t = typeof e.length == "number" ? [] : {};
for (var n in e) t[n] = clone(e[n]);
return t;
};

// Midi/inc/Base64.js

(function(e) {
var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
e.btoa || (e.btoa = function(n) {
n = escape(n);
var r = "", i, s, o = "", u, a, f, l = "", c = 0;
do i = n.charCodeAt(c++), s = n.charCodeAt(c++), o = n.charCodeAt(c++), u = i >> 2, a = (i & 3) << 4 | s >> 4, f = (s & 15) << 2 | o >> 6, l = o & 63, isNaN(s) ? f = l = 64 : isNaN(o) && (l = 64), r = r + t.charAt(u) + t.charAt(a) + t.charAt(f) + t.charAt(l), i = s = o = "", u = a = f = l = ""; while (c < n.length);
return r;
}), e.atob || (e.atob = function(e) {
var n = "", r, i, s = "", o, u, a, f = "", l = 0, c = /[^A-Za-z0-9\+\/\=]/g;
c.exec(e) && alert("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\nExpect errors in decoding."), e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
do o = t.indexOf(e.charAt(l++)), u = t.indexOf(e.charAt(l++)), a = t.indexOf(e.charAt(l++)), f = t.indexOf(e.charAt(l++)), r = o << 2 | u >> 4, i = (u & 15) << 4 | a >> 2, s = (a & 3) << 6 | f, n += String.fromCharCode(r), a != 64 && (n += String.fromCharCode(i)), f != 64 && (n += String.fromCharCode(s)), r = i = s = "", o = u = a = f = ""; while (l < e.length);
return unescape(n);
});
})(this);

// Midi/inc/base64binary.js

var Base64Binary = {
_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
decodeArrayBuffer: function(e) {
var t = Math.ceil(3 * e.length / 4), n = new ArrayBuffer(t);
return this.decode(e, n), n;
},
decode: function(e, t) {
var n = this._keyStr.indexOf(e.charAt(e.length - 1)), r = this._keyStr.indexOf(e.charAt(e.length - 1)), i = Math.ceil(3 * e.length / 4);
n == 64 && i--, r == 64 && i--;
var s, o, u, a, f, l, c, h, p = 0, d = 0;
t ? s = new Uint8Array(t) : s = new Uint8Array(i), e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
for (p = 0; p < i; p += 3) f = this._keyStr.indexOf(e.charAt(d++)), l = this._keyStr.indexOf(e.charAt(d++)), c = this._keyStr.indexOf(e.charAt(d++)), h = this._keyStr.indexOf(e.charAt(d++)), o = f << 2 | l >> 4, u = (l & 15) << 4 | c >> 2, a = (c & 3) << 6 | h, s[p] = o, c != 64 && (s[p + 1] = u), h != 64 && (s[p + 2] = a);
return s;
}
};

// Buzz/buzz.js

(function(e, t, n) {
typeof module != "undefined" && module.exports ? module.exports = n() : typeof t.define == "function" && t.define.amd ? define(e, [], n) : t[e] = n();
})("buzz", this, function() {
var e = {
defaults: {
autoplay: !1,
duration: 5e3,
formats: [],
loop: !1,
placeholder: "--",
preload: "metadata",
volume: 80,
document: document
},
types: {
mp3: "audio/mpeg",
ogg: "audio/ogg",
wav: "audio/wav",
aac: "audio/aac",
m4a: "audio/x-m4a"
},
sounds: [],
el: document.createElement("audio"),
sound: function(t, n) {
function a(e) {
var t = [], n = e.length - 1;
for (var r = 0; r <= n; r++) t.push({
start: e.start(r),
end: e.end(r)
});
return t;
}
function f(e) {
return e.split(".").pop();
}
function l(t, n) {
var i = r.createElement("source");
i.src = n, e.types[f(n)] && (i.type = e.types[f(n)]), t.appendChild(i);
}
n = n || {};
var r = n.document || e.defaults.document, i = 0, s = [], o = {}, u = e.isSupported();
this.load = function() {
return u ? (this.sound.load(), this) : this;
}, this.play = function() {
return u ? (this.sound.play(), this) : this;
}, this.togglePlay = function() {
return u ? (this.sound.paused ? this.sound.play() : this.sound.pause(), this) : this;
}, this.pause = function() {
return u ? (this.sound.pause(), this) : this;
}, this.isPaused = function() {
return u ? this.sound.paused : null;
}, this.stop = function() {
return u ? (this.setTime(0), this.sound.pause(), this) : this;
}, this.isEnded = function() {
return u ? this.sound.ended : null;
}, this.loop = function() {
return u ? (this.sound.loop = "loop", this.bind("ended.buzzloop", function() {
this.currentTime = 0, this.play();
}), this) : this;
}, this.unloop = function() {
return u ? (this.sound.removeAttribute("loop"), this.unbind("ended.buzzloop"), this) : this;
}, this.mute = function() {
return u ? (this.sound.muted = !0, this) : this;
}, this.unmute = function() {
return u ? (this.sound.muted = !1, this) : this;
}, this.toggleMute = function() {
return u ? (this.sound.muted = !this.sound.muted, this) : this;
}, this.isMuted = function() {
return u ? this.sound.muted : null;
}, this.setVolume = function(e) {
return u ? (e < 0 && (e = 0), e > 100 && (e = 100), this.volume = e, this.sound.volume = e / 100, this) : this;
}, this.getVolume = function() {
return u ? this.volume : this;
}, this.increaseVolume = function(e) {
return this.setVolume(this.volume + (e || 1));
}, this.decreaseVolume = function(e) {
return this.setVolume(this.volume - (e || 1));
}, this.setTime = function(e) {
if (!u) return this;
var t = !0;
return this.whenReady(function() {
t === !0 && (t = !1, this.sound.currentTime = e);
}), this;
}, this.getTime = function() {
if (!u) return null;
var t = Math.round(this.sound.currentTime * 100) / 100;
return isNaN(t) ? e.defaults.placeholder : t;
}, this.setPercent = function(t) {
return u ? this.setTime(e.fromPercent(t, this.sound.duration)) : this;
}, this.getPercent = function() {
if (!u) return null;
var t = Math.round(e.toPercent(this.sound.currentTime, this.sound.duration));
return isNaN(t) ? e.defaults.placeholder : t;
}, this.setSpeed = function(e) {
return u ? (this.sound.playbackRate = e, this) : this;
}, this.getSpeed = function() {
return u ? this.sound.playbackRate : null;
}, this.getDuration = function() {
if (!u) return null;
var t = Math.round(this.sound.duration * 100) / 100;
return isNaN(t) ? e.defaults.placeholder : t;
}, this.getPlayed = function() {
return u ? a(this.sound.played) : null;
}, this.getBuffered = function() {
return u ? a(this.sound.buffered) : null;
}, this.getSeekable = function() {
return u ? a(this.sound.seekable) : null;
}, this.getErrorCode = function() {
return u && this.sound.error ? this.sound.error.code : 0;
}, this.getErrorMessage = function() {
if (!u) return null;
switch (this.getErrorCode()) {
case 1:
return "MEDIA_ERR_ABORTED";
case 2:
return "MEDIA_ERR_NETWORK";
case 3:
return "MEDIA_ERR_DECODE";
case 4:
return "MEDIA_ERR_SRC_NOT_SUPPORTED";
default:
return null;
}
}, this.getStateCode = function() {
return u ? this.sound.readyState : null;
}, this.getStateMessage = function() {
if (!u) return null;
switch (this.getStateCode()) {
case 0:
return "HAVE_NOTHING";
case 1:
return "HAVE_METADATA";
case 2:
return "HAVE_CURRENT_DATA";
case 3:
return "HAVE_FUTURE_DATA";
case 4:
return "HAVE_ENOUGH_DATA";
default:
return null;
}
}, this.getNetworkStateCode = function() {
return u ? this.sound.networkState : null;
}, this.getNetworkStateMessage = function() {
if (!u) return null;
switch (this.getNetworkStateCode()) {
case 0:
return "NETWORK_EMPTY";
case 1:
return "NETWORK_IDLE";
case 2:
return "NETWORK_LOADING";
case 3:
return "NETWORK_NO_SOURCE";
default:
return null;
}
}, this.set = function(e, t) {
return u ? (this.sound[e] = t, this) : this;
}, this.get = function(e) {
return u ? e ? this.sound[e] : this.sound : null;
}, this.bind = function(e, t) {
if (!u) return this;
e = e.split(" ");
var n = this, r = function(e) {
t.call(n, e);
};
for (var i = 0; i < e.length; i++) {
var o = e[i], a = o;
o = a.split(".")[0], s.push({
idx: a,
func: r
}), this.sound.addEventListener(o, r, !0);
}
return this;
}, this.unbind = function(e) {
if (!u) return this;
e = e.split(" ");
for (var t = 0; t < e.length; t++) {
var n = e[t], r = n.split(".")[0];
for (var i = 0; i < s.length; i++) {
var o = s[i].idx.split(".");
if (s[i].idx == n || o[1] && o[1] == n.replace(".", "")) this.sound.removeEventListener(r, s[i].func, !0), s.splice(i, 1);
}
}
return this;
}, this.bindOnce = function(e, t) {
if (!u) return this;
var n = this;
return o[i++] = !1, this.bind(e + "." + i, function() {
o[i] || (o[i] = !0, t.call(n)), n.unbind(e + "." + i);
}), this;
}, this.trigger = function(e) {
if (!u) return this;
e = e.split(" ");
for (var t = 0; t < e.length; t++) {
var n = e[t];
for (var i = 0; i < s.length; i++) {
var o = s[i].idx.split(".");
if (s[i].idx == n || o[0] && o[0] == n.replace(".", "")) {
var a = r.createEvent("HTMLEvents");
a.initEvent(o[0], !1, !0), this.sound.dispatchEvent(a);
}
}
}
return this;
}, this.fadeTo = function(t, n, r) {
function a() {
setTimeout(function() {
i < t && o.volume < t ? (o.setVolume(o.volume += 1), a()) : i > t && o.volume > t ? (o.setVolume(o.volume -= 1), a()) : r instanceof Function && r.apply(o);
}, s);
}
if (!u) return this;
n instanceof Function ? (r = n, n = e.defaults.duration) : n = n || e.defaults.duration;
var i = this.volume, s = n / Math.abs(i - t), o = this;
return this.play(), this.whenReady(function() {
a();
}), this;
}, this.fadeIn = function(e, t) {
return u ? this.setVolume(0).fadeTo(100, e, t) : this;
}, this.fadeOut = function(e, t) {
return u ? this.fadeTo(0, e, t) : this;
}, this.fadeWith = function(e, t) {
return u ? (this.fadeOut(t, function() {
this.stop();
}), e.play().fadeIn(t), this) : this;
}, this.whenReady = function(e) {
if (!u) return null;
var t = this;
this.sound.readyState === 0 ? this.bind("canplay.buzzwhenready", function() {
e.call(t);
}) : e.call(t);
};
if (u && t) {
for (var c in e.defaults) e.defaults.hasOwnProperty(c) && (n[c] = n[c] || e.defaults[c]);
this.sound = r.createElement("audio");
if (t instanceof Array) for (var h in t) t.hasOwnProperty(h) && l(this.sound, t[h]); else if (n.formats.length) for (var p in n.formats) n.formats.hasOwnProperty(p) && l(this.sound, t + "." + n.formats[p]); else l(this.sound, t);
n.loop && this.loop(), n.autoplay && (this.sound.autoplay = "autoplay"), n.preload === !0 ? this.sound.preload = "auto" : n.preload === !1 ? this.sound.preload = "none" : this.sound.preload = n.preload, this.setVolume(n.volume), e.sounds.push(this);
}
},
group: function(e) {
function t() {
var t = n(null, arguments), r = t.shift();
for (var i = 0; i < e.length; i++) e[i][r].apply(e[i], t);
}
function n(e, t) {
return e instanceof Array ? e : Array.prototype.slice.call(t);
}
e = n(e, arguments), this.getSounds = function() {
return e;
}, this.add = function(t) {
t = n(t, arguments);
for (var r = 0; r < t.length; r++) e.push(t[r]);
}, this.remove = function(t) {
t = n(t, arguments);
for (var r = 0; r < t.length; r++) for (var i = 0; i < e.length; i++) if (e[i] == t[r]) {
e.splice(i, 1);
break;
}
}, this.load = function() {
return t("load"), this;
}, this.play = function() {
return t("play"), this;
}, this.togglePlay = function() {
return t("togglePlay"), this;
}, this.pause = function(e) {
return t("pause", e), this;
}, this.stop = function() {
return t("stop"), this;
}, this.mute = function() {
return t("mute"), this;
}, this.unmute = function() {
return t("unmute"), this;
}, this.toggleMute = function() {
return t("toggleMute"), this;
}, this.setVolume = function(e) {
return t("setVolume", e), this;
}, this.increaseVolume = function(e) {
return t("increaseVolume", e), this;
}, this.decreaseVolume = function(e) {
return t("decreaseVolume", e), this;
}, this.loop = function() {
return t("loop"), this;
}, this.unloop = function() {
return t("unloop"), this;
}, this.setTime = function(e) {
return t("setTime", e), this;
}, this.set = function(e, n) {
return t("set", e, n), this;
}, this.bind = function(e, n) {
return t("bind", e, n), this;
}, this.unbind = function(e) {
return t("unbind", e), this;
}, this.bindOnce = function(e, n) {
return t("bindOnce", e, n), this;
}, this.trigger = function(e) {
return t("trigger", e), this;
}, this.fade = function(e, n, r, i) {
return t("fade", e, n, r, i), this;
}, this.fadeIn = function(e, n) {
return t("fadeIn", e, n), this;
}, this.fadeOut = function(e, n) {
return t("fadeOut", e, n), this;
};
},
all: function() {
return new e.group(e.sounds);
},
isSupported: function() {
return !!e.el.canPlayType;
},
isOGGSupported: function() {
return !!e.el.canPlayType && e.el.canPlayType('audio/ogg; codecs="vorbis"');
},
isWAVSupported: function() {
return !!e.el.canPlayType && e.el.canPlayType('audio/wav; codecs="1"');
},
isMP3Supported: function() {
return !!e.el.canPlayType && e.el.canPlayType("audio/mpeg;");
},
isAACSupported: function() {
return !!e.el.canPlayType && (e.el.canPlayType("audio/x-m4a;") || e.el.canPlayType("audio/aac;"));
},
toTimer: function(e, t) {
var n, r, i;
return n = Math.floor(e / 3600), n = isNaN(n) ? "--" : n >= 10 ? n : "0" + n, r = t ? Math.floor(e / 60 % 60) : Math.floor(e / 60), r = isNaN(r) ? "--" : r >= 10 ? r : "0" + r, i = Math.floor(e % 60), i = isNaN(i) ? "--" : i >= 10 ? i : "0" + i, t ? n + ":" + r + ":" + i : r + ":" + i;
},
fromTimer: function(e) {
var t = e.toString().split(":");
return t && t.length == 3 && (e = parseInt(t[0], 10) * 3600 + parseInt(t[1], 10) * 60 + parseInt(t[2], 10)), t && t.length == 2 && (e = parseInt(t[0], 10) * 60 + parseInt(t[1], 10)), e;
},
toPercent: function(e, t, n) {
var r = Math.pow(10, n || 0);
return Math.round(e * 100 / t * r) / r;
},
fromPercent: function(e, t, n) {
var r = Math.pow(10, n || 0);
return Math.round(t / 100 * e * r) / r;
}
};
return e;
});
