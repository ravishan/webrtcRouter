import expect from 'expect.js';
import { findPeerChannel,forwardMessage } from '../client/router';


describe("router spec",() => {
	let sendChannel = {
 	 		1: "sample_1",
 	 		2: "sample_2"
 	}
 	let receiveChannel = {
 	 		3: "sample_3",
 	 		4: "sample_4"
 	}
 	let forwardTable = {
 		5: 4
 	}
	it("Should find the peerChannel",() => {
 		expect(findPeerChannel(sendChannel,receiveChannel,forwardTable,5)).to.eql("sample_4")
	})
	it("Should forward message to next peer in the path to the targeted peer or to the target peer itself",() => {
		let current_ForwardMessage = forwardMessage(1)
		let data = JSON.stringify({
 				targetId: 5,
			 	message: "sample"
			});
		let actual = current_ForwardMessage({ data })
 	 	expect(actual).to.eql({ NeedToForward: true, targetId: 5 });
	});

	it("Should not forward the message if the message is sent to the current node",() => {
	 	let current_ForwardMessage = forwardMessage(1)
		let data = JSON.stringify({
 				targetId: 1,
			 	message: "sample"
			});
		let actual = current_ForwardMessage({ data })
 	 	expect(actual).to.eql({ NeedToForward: false });
	})

});