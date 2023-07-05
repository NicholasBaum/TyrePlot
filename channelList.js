class ChannelList {
    constructor(containerId, plotter) {
        this.containerId = containerId;
        this.plotter = plotter;
        plotter.addOnChanged(() => {
            this.create();
        });
    }

    get channels() { return this.plotter.lines; }

    create() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = '';

        const list = document.createElement('ul');
        list.classList.add('list-group');

        this.channels.forEach(channel => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');

            const itemContent = document.createElement('div');
            itemContent.classList.add('d-flex', 'justify-content-between', 'align-items-center');

            const channelInfo = document.createElement('div');
            channelInfo.classList.add('d-flex', 'align-items-center');

            const checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.classList.add('form-check-input', 'me-2');
            checkbox.checked = channel.visible;
            checkbox.addEventListener('change', () => {
                channel.visible = checkbox.checked;
                this.plotter.render();
            });

            const channelName = document.createElement('span');
            channelName.textContent = channel.name;

            channelInfo.appendChild(checkbox);
            channelInfo.appendChild(channelName);

            const collapseLink = document.createElement('a');
            collapseLink.classList.add('collapsed');
            collapseLink.setAttribute('data-bs-toggle', 'collapse');
            collapseLink.setAttribute('href', `#${channel.id}-settings`);
            collapseLink.setAttribute('role', 'button');
            collapseLink.setAttribute('aria-expanded', 'false');
            collapseLink.setAttribute('aria-controls', `${channel.id}-settings`);

            const collapseIcon = document.createElement('i');
            collapseIcon.classList.add('fas', 'fa-chevron-down');

            collapseLink.appendChild(collapseIcon);

            itemContent.appendChild(channelInfo);
            itemContent.appendChild(collapseLink);

            const collapseDiv = document.createElement('div');
            collapseDiv.classList.add('collapse', 'mt-3');
            collapseDiv.setAttribute('id', `${channel.id}-settings`);

            const channelSettings = document.createElement('div');
            channelSettings.classList.add('form-group', 'd-flex', 'align-items-center');

            const colorLabel = document.createElement('label');
            colorLabel.setAttribute('for', `${channel.id}-color`);
            colorLabel.classList.add('me-2');
            colorLabel.textContent = 'Color:';

            const colorInput = document.createElement('input');
            colorInput.setAttribute('type', 'color');
            colorInput.setAttribute('id', `${channel.id}-color`);
            colorInput.classList.add('form-control');
            colorInput.value = channel.color;
            colorInput.addEventListener('input', () => {
                channel.color = colorInput.value;
                this.plotter.render();
            });

            channelSettings.appendChild(colorLabel);
            channelSettings.appendChild(colorInput);

            collapseDiv.appendChild(channelSettings);

            listItem.appendChild(itemContent);
            listItem.appendChild(collapseDiv);

            list.appendChild(listItem);
        });

        container.appendChild(list);
    }
}