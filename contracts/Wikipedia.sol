pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Wikipedia {
  uint public wikiCount = 0;

  struct wiki {
    uint id;
    string heading;
    string content;
    string images;
  }

  mapping(uint => wiki) public wikiMap;

  event wikiCreated(
    uint id,
    string heading,
    string content,
    string images
  );

  constructor() public {
    createWiki("Milky Way","It is estimated to contain 100–400 billion stars and at least that number of planets.The Solar System is located at a radius of about 27,000 light-years from the Galactic Center, on the inner edge of the Orion Arm, one of the spiral-shaped concentrations of gas and dust. The stars in the innermost 10,000 light-years form a bulge and one or more bars that radiate from the bulge. The galactic center is an intense radio source known as Sagittarius A*, asupermassive black hole of 4.100 (± 0.034) million solar masses. Stars and gases at a wide range of distances from the Galactic Center orbit at approximately 220 kilometers per second. The constant rotation speed contradicts the laws of Keplerian dynamics and suggests that much (about 90%) of the mass of the Milky Way is invisible to telescopes, neither emitting nor absorbing electromagnetic radiation. This conjectural mass has been termed dark matter. The rotational period is about 240 million years at the radius of the Sun. The Milky Way as a whole is moving at a velocity of approximately 600 km per second with respect to extragalactic frames of reference. The oldest stars in the Milky Way are nearly as old as the Universe itself and thus probably formed shortly after the Dark Ages of the Big Bang.","https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg");
  }

  function createWiki(string memory _header, string memory _content, string memory _images) public {
    wikiCount++;
    wikiMap[wikiCount] = wiki(wikiCount, _header, _content, _images);
    emit wikiCreated(wikiCount, _header, _content, _images);
  }

}
